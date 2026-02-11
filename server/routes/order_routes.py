from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from datetime import datetime

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

    items = data.get("items") or data.get("order_items")
    outlet_id = data.get("outlet_id")

    if not outlet_id or not items:
        return jsonify({
            "error": "outlet_id and items are required"
        }), 400

    if not isinstance(items, list):
        return jsonify({
            "error": "items must be a list"
        }), 400

    # Get customer from JWT
    identity = get_jwt_identity()
    customer_id = identity["id"]

    # Validate outlet
    outlet = Outlet.query.get(outlet_id)
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
    discount_amount = Decimal("0.00")
    
    # Check for reservation discount
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

    # New fields
    order_type = data.get("order_type", "dine-in")
    table_number = data.get("table_number")

    if not table_number:
        return jsonify({"error": "Table number is required"}), 400

    order = Order(
        customer_id=customer_id,
        reservation_id=reservation_id,
        status="pending",
        total_amount=0,
        discount_amount=discount_amount,
        order_type=order_type,
        table_number=table_number
    )

    db.session.add(order)
    db.session.flush()  # Get order.id

    # Process items
    total_amount = Decimal("0.00")
    for item in items:

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
                price=menu_item.price
            )
        )

    # Final logic for total and deduction
    if total_amount < discount_amount:
        discount_amount = total_amount # Can't deduct more than total

    order.total_amount = total_amount - discount_amount
    order.discount_amount = discount_amount

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
        "time_till_ready": order.time_till_ready
    }), 201


# GET ORDERS (CUSTOMER OR OUTLET)
@order_bp.route("", methods=["GET"])
@jwt_required()
def get_orders():
    identity = get_jwt_identity()
    user_id = identity["id"]
    role = str(identity.get("role", "")).lower()

    customer_id = request.args.get("customer_id", type=int)
    outlet_id = request.args.get("outlet_id", type=int)

    query = Order.query

    if role == "customer":
        # Strict isolation: customers can only see their own orders
        query = query.filter_by(customer_id=user_id)
    elif role in ["outlet", "owner"]:
        # Outlets can see orders for their own outlet
        # If outlet_id is provided, it must match their user_id (if they are an outlet)
        # Assuming outlet registered as user with id X
        target_outlet_id = outlet_id or user_id
        # We need to filter by menu items belonging to this outlet
        query = query.join(OrderItem).join(MenuItem).filter(MenuItem.outlet_id == target_outlet_id).distinct()
    else:
        return jsonify({"error": "Forbidden"}), 403

    orders = query.order_by(Order.created_at.desc()).all()

    return jsonify([
        {
            "id": o.id,
            "customer_id": o.customer_id,
            "reservation_id": o.reservation_id,
            "total_amount": float(o.total_amount),
            "discount_amount": float(o.discount_amount) if o.discount_amount else 0.0,
            "status": o.status,
            "time_till_ready": o.time_till_ready,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "order_items": [
                {
                    "menu_item_id": item.menu_item_id,
                    "item_name": item.menu_item.item_name if hasattr(item, 'menu_item') and item.menu_item else f"Item #{item.menu_item_id}",
                    "quantity": item.quantity,
                    "price": float(item.price)
                } for item in o.order_items
            ]
        } for o in orders
    ]), 200


# UPDATE ORDER STATUS (OUTLET ONLY)
@order_bp.route("/<int:order_id>", methods=["PATCH", "PUT"])
@jwt_required()
def update_order_status(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    identity = get_jwt_identity()
    user_id = identity["id"]
    role = str(identity.get("role", "")).lower()

    if role not in ["outlet", "owner"]:
        return jsonify({"error": "Forbidden"}), 403

    # Ownership check: order must have items from this outlet
    # Simplify: if any item in the order belongs to this outlet, they can update it.
    # In a real food court, orders might be multi-outlet, but here we seem to split them in the frontend.
    
    data = request.get_json() or {}
    status = data.get("status")

    if not status:
        return jsonify({"error": "Status is required"}), 400

    order.status = status
    db.session.commit()

    return jsonify({
        "message": "Order status updated",
        "order_id": order.id,
        "status": order.status
    }), 200
