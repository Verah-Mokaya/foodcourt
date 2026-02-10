from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from decimal import Decimal

from extensions import db

from models import (
    Order,
    OrderItem,
    MenuItem,
    Outlet,
    Reservation,
    FoodCourtTable
)

from utils import customer_required


order_bp = Blueprint("orders", __name__, url_prefix="/orders")


# CREATE ORDER (CUSTOMER ONLY)

@order_bp.route("", methods=["POST"])
@jwt_required()
@customer_required
def create_order():

    data = request.get_json() or {}

    # Validate request body
    if not data.get("outlet_id") or not data.get("items"):
        return jsonify({
            "error": "outlet_id and items are required"
        }), 400

    if not isinstance(data["items"], list):
        return jsonify({
            "error": "items must be a list"
        }), 400

    # Get customer from JWT
    identity = get_jwt_identity()
    customer_id = identity["id"]

    # Validate outlet
    outlet = Outlet.query.get(data["outlet_id"])
    if not outlet:
        return jsonify({"error": "Outlet not found"}), 404

    # Validate reservation (optional)
    reservation_id = data.get("reservation_id")

    if reservation_id:

        reservation = Reservation.query.get(reservation_id)

        if not reservation:
            return jsonify({"error": "Invalid reservation"}), 400

        if reservation.customer_id != customer_id:
            return jsonify({"error": "Unauthorized reservation"}), 403

        if reservation.status != "confirmed":
            return jsonify({"error": "Reservation not confirmed"}), 400

    # Create order
    total_amount = Decimal("0.00")

    # check for reservation coupon
    target_res = None
    if reservation_id:
        target_res = Reservation.query.get(reservation_id)
        if target_res and target_res.status != "confirmed":
            target_res = None # Only apply to confirmed
    else:
        # Auto-find a confirmed reservation for today
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        target_res = Reservation.query.filter(
            Reservation.customer_id == customer_id,
            Reservation.outlet_id == outlet_id,
            Reservation.status == "confirmed",
            Reservation.time_reserved_for >= today_start,
            Reservation.is_fee_deducted == False
        ).first()

    if target_res:
        discount_amount = Decimal("5.00")
        reservation_id = target_res.id

    order = Order(
        customer_id=customer_id,
        reservation_id=reservation_id,
        status="pending",
        total_amount=0,
        discount_amount=discount_amount
    )

    db.session.add(order)
    db.session.flush()  # Get order.id

    # Process items
    for item in data["items"]:

        if "menu_item_id" not in item:
            db.session.rollback()
            return jsonify({
                "error": "menu_item_id is required"
            }), 400

        menu_item = MenuItem.query.get(item["menu_item_id"])

        if not menu_item:
            db.session.rollback()
            return jsonify({"error": "Menu item not found"}), 404

        if menu_item.outlet_id != outlet.id:
            db.session.rollback()
            return jsonify({"error": "Invalid menu item"}), 400

        if not menu_item.is_available:
            db.session.rollback()
            return jsonify({"error": "Item unavailable"}), 400

        quantity = int(item.get("quantity", 1))

        if quantity < 1:
            db.session.rollback()
            return jsonify({"error": "Invalid quantity"}), 400

        subtotal = Decimal(menu_item.price) * quantity
        total_amount += subtotal

        db.session.add(
            OrderItem(
                order_id=order.id,
                menu_item_id=menu_item.id,
                quantity=quantity,
                price=menu_item.price,
                time_to_prepare=menu_item.time_to_prepare
            )
        )

    
    if total_amount < discount_amount:
        discount_amount= total_amount
        order.total_amount = total_amount-discount_amount

    if target_res and discount_amount > 0:
        target_res.is_fee_deducted = True 
        
    # Calculate ETA: max item prep time + 10-15 min buffer (using 12 min as default)
    prep_times = [item.menu_item.preparation_time for item in order.order_items]
    if prep_times:
        order.time_till_ready = max(prep_times) + 12
    else:
        order.time_till_ready = 15

    db.session.commit()

    return jsonify({
        "order_id": order.id,
        "status": order.status,
        "total_amount": float(order.total_amount),
        "estimated_time": order.estimated_time
    }), 201


# GET ORDERS (CUSTOMER ONLY)
@order_bp.route("", methods=["GET"])
@jwt_required()
@customer_required
def get_orders():
    
    identity = get_jwt_identity()
    customer_id = identity["id"]
    
    orders = Order.query.filter_by(customer_id=customer_id).order_by(Order.created_at.desc()).all()
    
    output = []
    
    for order in orders:
        items_data = []
        for item in order.order_items:
            items_data.append({
                "item_name": item.menu_item.item_name if item.menu_item else "Unknown Item",
                "quantity": item.quantity,
                "price": float(item.price)
            })
            
        output.append({
            "id": order.id,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "total_amount": float(order.total_amount),
            "status": order.status,
            "estimated_time": order.estimated_time,
            "items": items_data
        })
        
    return jsonify(output), 200
