from flask import Blueprint, app, jsonify, request
from routes.outlet_routes import outlet_bp
from flask_jwt_extended import get_jwt_identity, jwt_required
from models.outlet import Outlet,
from utils.auth import outlet_only

outlet_bp=Blueprint('outlet', __name__)

app.register_blueprint(outlet_bp, url_prefix='/outlets')

def outlet_only():
    claims = get_jwt_identity()
    if claims.get("role") != "outlet":
        return False
    return True

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