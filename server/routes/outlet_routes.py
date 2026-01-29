from flask import Blueprint, app, jsonify, request
from routes.outlet_routes import outlet_bp
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import Outlet,
from utils.auth import outlet_only
from extensions import db

outlet_bp=Blueprint('outlet', __name__)

app.register_blueprint(outlet_bp, url_prefix='/outlets')

def outlet_only():
    claims = get_jwt_identity()
    if claims.get("role") != "outlet":
        return False
    return True

# Outlet Routes
@outlet_bp.route("/<int:outlet_id>", methods=["GET"])
@jwt_required()
def get_outlet(outlet_id):
    if not outlet_only():
        return jsonify({"error": "Unauthorized"}), 403

    if outlet_id != get_jwt_identity():
        return jsonify({"error": "Forbidden"}), 403

    outlet = Outlet.query.get_or_404(outlet_id)

    return jsonify({
        "id": outlet.id,
        "name": outlet.name,
        "email": outlet.email,
        "cuisine_type": outlet.cuisine_type,
        "is_active": outlet.is_active
    })


@outlet_bp.route("/<int:outlet_id>", methods=["PUT"])
@jwt_required()
def update_outlet(outlet_id):
    if not outlet_only():
        return jsonify({"error": "Unauthorized"}), 403

    if outlet_id != get_jwt_identity():
        return jsonify({"error": "Forbidden"}), 403

    outlet = Outlet.query.get_or_404(outlet_id)
    data = request.get_json()

    outlet.name = data.get("name", outlet.name)
    outlet.cuisine_type = data.get("cuisine_type", outlet.cuisine_type)
    outlet.email = data.get("email", outlet.email)

    db.session.commit()

    return jsonify({"message": "Outlet updated successfully"})

@outlet_bp.route("/<int:outlet_id>/status", methods=["PUT"])
@jwt_required()
def toggle_outlet_status(outlet_id):
    if not outlet_only():
        return jsonify({"error": "Unauthorized"}), 403

    if outlet_id != get_jwt_identity():
        return jsonify({"error": "Forbidden"}), 403

    outlet = Outlet.query.get_or_404(outlet_id)
    outlet.is_active = not outlet.is_active

    db.session.commit()

    return jsonify({
        "message": "Outlet status updated",
        "is_active": outlet.is_active
    })

@outlet_bp.route("", methods=["GET"])
def list_outlets():
    outlets = Outlet.query.filter_by(is_active=True).all()

    return jsonify([
        {
            "id": o.id,
            "name": o.name,
            "cuisine_type": o.cuisine_type
        } for o in outlets
    ])