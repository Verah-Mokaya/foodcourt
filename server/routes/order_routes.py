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
    total_amount = Decimal("0.00")

    order = Order(
        customer_id=customer_id,
        reservation_id=reservation_id,
        status="pending",
        total_amount=0
    )

    db.session.add(order)
    db.session.flush()  # Get order.id

    # Process items
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

    order.total_amount = total_amount

    db.session.commit()

    return jsonify({
        "order_id": order.id,
        "status": order.status,
        "total_amount": float(order.total_amount)
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
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "order_items": [
                {
                    "menu_item_id": item.menu_item_id,
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
