from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import Reservation, FoodCourtTable
@order_bp.route("", methods=["POST"])
@jwt_required()
def create_order():
    try:
        data = request.get_json()
        customer_id = get_jwt_identity()

        if "outlet_id" not in data or "items" not in data:
            return {"error": "Missing required fields"}, 400

        outlet = Outlet.query.get(data["outlet_id"])
        if not outlet:
            return {"error": "Outlet not found"}, 404

        total_amount = Decimal("0.00")

        order = Order(
            customer_id=customer_id,
            outlet_id=data["outlet_id"],
            table_booking_id=data.get("table_booking_id"),
            status="pending",
            total_amount=0,
            estimated_time=data.get("estimated_time"),
        )

        db.session.add(order)
        db.session.flush()  # get order.id

        for item in data["items"]:
            menu_item = MenuItem.query.get(item["menu_item_id"])
            if not menu_item or menu_item.outlet_id != data["outlet_id"]:
                db.session.rollback()
                return {"error": "Invalid menu item"}, 400

            if not menu_item.is_available:
                db.session.rollback()
                return {"error": "Menu item unavailable"}, 400

            quantity = item.get("quantity", 1)
            subtotal = menu_item.price * quantity
            total_amount += subtotal

            db.session.add(
                OrderItem(
                    order_id=order.id,
                    menu_item_id=menu_item.id,
                    quantity=quantity,
                    price=menu_item.price,
                )
            )

        order.total_amount = total_amount
        db.session.commit()

        return {
            "order_id": order.id,
            "status": order.status,
            "total_amount": float(order.total_amount),
        }, 201

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
