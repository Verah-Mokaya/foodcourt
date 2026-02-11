from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import MenuItem, Outlet

from utils import outlet_required


menu_bp = Blueprint("menu", __name__)


# GET ALL OUTLETS (PUBLIC)
@menu_bp.route("/outlets", methods=["GET"])
def get_all_outlets():
    outlets = Outlet.query.filter_by(is_active=True).all()
    return jsonify([
        {
            "id": o.id,
            "outlet_name": o.outlet_name,
            "cuisine_type": o.cuisine_type,
            "description": o.description,
            "image_url": getattr(o, "image_url", None) or "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000",
            "is_active": o.is_active
        }
        for o in outlets
    ]), 200


# GET ALL MENU ITEMS (PUBLIC)
@menu_bp.route("/menu_items", methods=["GET"])
def get_all_menu_items():
    items = MenuItem.query.all()
    return jsonify([
        {
            "id": item.id,
            "item_name": item.item_name,
            "description": item.description,
            "category": item.category,
            "price": float(item.price),
            "image_url": item.image_url,
            "is_available": item.is_available,
            "preparation_time": item.preparation_time,
            "outlet_id": item.outlet_id
        }
        for item in items
    ]), 200


# @menu_bp.route("/menu_items/<int:outlet_id>", methods=["GET"])
# def get_all_menu_items(outlet_id):
#     items = MenuItem.query.all()
#     query = MenuItem.query.filter_by(outlet_id=outlet_id)
#     return jsonify([
#         {
#             "id": item.id,
#             "item_name": item.item_name,
#             "description": item.description,
#             "category": item.category,
#             "price": float(item.price),
#             "image_url": item.image_url,
#             "is_available": item.is_available,
#             "outlet_id": item.outlet_id
#         }
#         for item in items
#     ]), 200


# GET OUTLET MENU (PUBLIC)
@menu_bp.route("/outlets/<int:outlet_id>", methods=["GET"])
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
                "preparation_time": item.preparation_time,
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
        "preparation_time": item.preparation_time,
        "created_at": item.created_at.isoformat() if item.created_at else None,
        "outlet_id": item.outlet_id
    }), 200


import os
from werkzeug.utils import secure_filename
from flask import current_app

# ... (inside create_menu_item)

@menu_bp.route("/item", methods=["POST"])
@jwt_required()
@outlet_required
def create_menu_item():

    # Check content type to distinguish between JSON and Multipart
    if request.content_type.startswith('multipart/form-data'):
        data = request.form
        image_file = request.files.get("image")
    else:
        data = request.get_json() or {}
        image_file = None

    required = ["item_name", "price", "category"]

    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Get outlet from JWT
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

    # Handle Image Upload
    image_url = data.get("image_url") # Default/Fallback
    if image_file:
        filename = secure_filename(image_file.filename)
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        
        # Ensure directory exists (redundant safety)
        os.makedirs(upload_folder, exist_ok=True)
        
        image_path = os.path.join(upload_folder, filename)
        image_file.save(image_path)
        
        # Generate URL
        # Assumption: server is running on port 5000 and static files are served from /static
        # In production, this might need domain config, but for now:
        image_url = f"http://localhost:5000/static/uploads/{filename}"

    new_item = MenuItem(
        outlet_id=outlet_id,
        item_name=data["item_name"],
        description=data.get("description"),
        category=data["category"],
        price=price,
        image_url=image_url,
        is_available=data.get("is_available", "true").lower() == "true", # Form data is string
        preparation_time=int(data.get("preparation_time", 15))
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify({
        "id": new_item.id,
        "item_name": new_item.item_name,
        "description": new_item.description,
        "category": new_item.category,
        "price": float(new_item.price),
        "image_url": new_item.image_url,
        "is_available": new_item.is_available,
        "preparation_time": new_item.preparation_time,
        "outlet_id": new_item.outlet_id
    }), 201


# UPDATE MENU ITEM (OWNER ONLY)
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
        "is_available",
        "preparation_time"
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
# DELETE MENU ITEM (OWNER ONLY)
@menu_bp.route("/item/<int:item_id>", methods=["DELETE"])
@jwt_required()
@outlet_required
def delete_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Menu item not found"}), 404
    
    identity = get_jwt_identity()
    if item.outlet_id != identity["id"]:
        return jsonify({"error": "Forbidden"}), 403
    
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Menu item deleted successfully"}), 200
