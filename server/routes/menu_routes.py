from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.menu_item import MenuItem
from app.extensions import db

menu_bp = Blueprint("menu", __name__)

@menu_bp.route("/", methods=["POST"])
@jwt_required()
def create_menu_item():
    data = request.json

    item = MenuItem(
        item_name=data["item_name"],
        outlet_id=data["outlet_id"],
        price=data["price"],
        category=data["category"]
    )

    db.session.add(item)
    db.session.commit()

    return jsonify(message="Menu item created"), 201
