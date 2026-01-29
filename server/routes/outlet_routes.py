from flask import Blueprint
from routes.outlet_routes import outlet_bp

outlet_bp=Blueprint('outlet', __name__)

app.register_blueprint(outlet_bp, url_prefix='/outlets')

