from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from extensions import db, bcrypt, jwt


app = Flask(__name__)

# configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://foodcourt_user:strongpassword@localhost:5432/foodcourt_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret

# initialize extensions
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

migrate = Migrate(app, db)

# register blueprints after initializing app and extensions
from routes.outlet_auth import outlet_auth
app.register_blueprint(outlet_auth)

# import models
import models

@app.route('/')
def home():
    return "Welcome to the Outlet Management System"

