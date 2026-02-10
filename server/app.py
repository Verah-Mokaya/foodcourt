import sys
import os
from flask_cors import CORS

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from models import *
from extensions import db, migrate, jwt, bcrypt

from routes.menu_routes import menu_bp
from routes.auth_routes import auth_bp
from routes.reservation_routes import reservation_bp
from routes.order_routes import order_bp
from routes.analytics_routes import analytics_bp

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(BASE_DIR, "instance", "foodcourt.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False  
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
    JSON_SORT_KEYS = False 

    # jwt cookie config
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SECURE = False   # True in production (HTTPS)
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_ACCESS_COOKIE_PATH = "/"

def create_app():
    app = Flask(__name__)
    
    # CORS Configuration 
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173"],
            "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db, render_as_batch=True)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Register blueprints with /api prefix
    app.register_blueprint(menu_bp, url_prefix="/api/menu")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(reservation_bp, url_prefix="/api/reservations")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

    # Health check route
    @app.route("/health")
    def health():
        return jsonify({"status": "OK", "message": "Food Court API is running"}), 200
    
    # Root route
    @app.route("/")
    def index():
        return jsonify({
            "message": "Welcome to Food Court API",
            "version": "1.0",
            "endpoints": {
                "health": "/health",
                "menu": "/api/menu-items",
                "auth": "/api/customers/login",
                "orders": "/api/orders",
                "reservations": "/api/reservations"
            }
        }), 200

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request"}), 400

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"error": "Invalid token"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"error": "Authorization token is missing"}), 401

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000, host="0.0.0.0")