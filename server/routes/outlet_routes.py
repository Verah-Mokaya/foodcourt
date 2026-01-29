from flask import Blueprint, app
from routes.outlet_routes import outlet_bp
from flask_jwt_extended import get_jwt_identity, jwt_required

outlet_bp=Blueprint('outlet', __name__)

app.register_blueprint(outlet_bp, url_prefix='/outlets')

def outlet_only():
    claims = get_jwt()
    if claims.get("role") != "outlet":
        return False
    return True