from flask import Flask
from extensions import db, migrate, jwt, bcrypt
from config import Config  

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.menu_routes import menu_bp
    from .routes.reservation_routes import reservation_bp
    from .routes.order_routes import order_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(menu_bp, url_prefix='/menu')
    app.register_blueprint(reservation_bp, url_prefix='/reservations')
    app.register_blueprint(order_bp, url_prefix='/orders')