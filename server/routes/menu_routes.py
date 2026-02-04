from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import MenuItem, Outlet

from utils import outlet_required, admin_required


menu_bp = Blueprint("menu", __name__, url_prefix="/menu")


# GET OUTLET MENU (PUBLIC)
@menu_bp.route("/<int:outlet_id>", methods=["GET"])
def get_outlet_menu(outlet_id):

    outlet = Outlet.query.get(outlet_id)

    if not outlet:
        return jsonify({"error": "Outlet not found"}), 404

    category = request.args.get("category")
    is_available = request.args.get("is_available")

    query = MenuItem.query.filter_by(outlet_id=outlet_id)

    if category:
        query = query.filter_by(category=category)

    if is_available is not None:
        is_available = is_available.lower() == "true"
        query = query.filter_by(is_available=is_available)

    items = query.all()

    return jsonify({
        "outlet_id": outlet.id,
        "outlet_name": outlet.outlet_name,
        "items": [
            {
                "id": item.id,
                "item_name": item.item_name,
                "description": item.description,
                "category": item.category,
                "price": float(item.price),
                "image_url": item.image_url,
                "is_available": item.is_available,
                "created_at": item.created_at.isoformat() if item.created_at else None
            }
            for item in items
        ]
    }), 200

# GET SINGLE ITEM (PUBLIC)
@menu_bp.route("/item/<int:item_id>", methods=["GET"])
def get_menu_item(item_id):

    item = MenuItem.query.get(item_id)

    if not item:
        return jsonify({"error": "Menu item not found"}), 404

    return jsonify({
        "id": item.id,
        "item_name": item.item_name,
        "description": item.description,
        "category": item.category,
        "price": float(item.price),
        "image_url": item.image_url,
        "is_available": item.is_available,
        "created_at": item.created_at.isoformat() if item.created_at else None,
        "outlet_id": item.outlet_id
    }), 200

# GET CATEGORIES (PUBLIC)
@menu_bp.route("/categories/<int:outlet_id>", methods=["GET"])
def get_menu_categories(outlet_id):

    outlet = Outlet.query.get(outlet_id)

    if not outlet:
        return jsonify({"error": "Outlet not found"}), 404

    categories = (
        db.session
        .query(MenuItem.category)
        .filter_by(outlet_id=outlet_id)
        .distinct()
        .all()
    )

    category_list = [c[0] for c in categories]

    return jsonify({
        "outlet_id": outlet.id,
        "outlet_name": outlet.outlet_name,
        "categories": category_list
    }), 200

# GET OUTLET MENU (OUTLET ONLY)
@menu_bp.route("/my-menu", methods=["GET"])
@jwt_required()
@outlet_required
def get_my_menu():

    # Get outlet id from JWT
    identity = get_jwt_identity()
    outlet_id = identity["id"]

    category = request.args.get("category")
    is_available = request.args.get("is_available")

    query = MenuItem.query.filter_by(outlet_id=outlet_id)

    if category:
        query = query.filter_by(category=category)

    if is_available is not None:
        is_available = is_available.lower() == "true"
        query = query.filter_by(is_available=is_available)

    items = query.all()

    return jsonify({
        "outlet_id": outlet_id,
        "items": [
            {
                "id": item.id,
                "item_name": item.item_name,
                "description": item.description,
                "category": item.category,
                "price": float(item.price),
                "image_url": item.image_url,
                "is_available": item.is_available,
                "created_at": item.created_at.isoformat() if item.created_at else None
            }
            for item in items
        ]
    }), 200



# CREATE MENU ITEM (OUTLET ONLY)
@menu_bp.route("/item", methods=["POST"])
@jwt_required()
@outlet_required
def create_menu_item():

    data = request.get_json() or {}

    required = ["item_name", "price", "category"]

    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Get outlet from JWT (NOT from request)
    identity = get_jwt_identity()
    outlet_id = identity["id"]

    outlet = Outlet.query.get(outlet_id)

    if not outlet:
        return jsonify({"error": "Outlet not found"}), 404

    # Validate price
    try:
        price = float(data["price"])
    except ValueError:
        return jsonify({"error": "Invalid price"}), 400

    new_item = MenuItem(
        outlet_id=outlet_id,
        item_name=data["item_name"],
        description=data.get("description"),
        category=data["category"],
        price=price,
        image_url=data.get("image_url"),
        is_available=data.get("is_available", True)
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify({
        "message": "Menu item created successfully",
        "item_id": new_item.id
    }), 201


# UPDATE MENU ITEM (OUTLET ONLY)
@menu_bp.route("/item/<int:item_id>", methods=["PUT"])
@jwt_required()
@outlet_required
def update_menu_item(item_id):

    item = MenuItem.query.get(item_id)

    if not item:
        return jsonify({"error": "Menu item not found"}), 404

    identity = get_jwt_identity()
    outlet_id = identity["id"]

    # Ownership check
    if item.outlet_id != outlet_id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}

    allowed_fields = [
        "item_name",
        "description",
        "category",
        "price",
        "image_url",
        "is_available"
    ]

    for field in allowed_fields:

        if field in data:

            if field == "price":
                try:
                    data[field] = float(data[field])
                except ValueError:
                    return jsonify({"error": "Invalid price"}), 400

            setattr(item, field, data[field])

    db.session.commit()

    return jsonify({
        "message": "Menu item updated successfully"
    }), 200



# GET ALL MENUS (ADMIN ONLY)
@menu_bp.route('/all', methods=["GET"])
@jwt_required
@admin_required
def get_all_menus():
    outlets = Outlet.query.all()
    result = []
    for outlet in outlets:
        items = MenuItem.query.filter_by(outlet_id=outlet.id).all()
        result.append({
            "outlet_id": outlet.id,
            "outlet_name": outlet.outlet_name,
            "items": [item.serialize() for item in items]
        })
    return jsonify(result), 200