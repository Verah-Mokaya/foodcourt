import sys
import os
from flask_cors import CORS

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from models import *
from extensions import db, migrate, jwt, bcrypt

from routes.menu_routes import menu_bp
from routes.auth_routes import auth_bp
from routes.reservation_routes import reservation_bp
from routes.order_routes import order_bp


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://foodcourt_user:strongpassword@localhost:5432/foodcourt_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    #  init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    #  register blueprints
    app.register_blueprint(menu_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(reservation_bp)
    app.register_blueprint(order_bp)

    @app.route("/health")
    def health():
        return {"status": "OK"}, 200

    @app.route("/db-test")
    def db_test():
        from sqlalchemy import text
        db.session.execute(text("SELECT 1"))
        return {"db": "connected"}, 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
