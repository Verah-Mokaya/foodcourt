from flask import Blueprint, request, jsonify
from server.extensions import db, bcrypt
from server.models.customer import Customer
from flask_jwt_extended import create_access_token
from server.models.outlet import Outlet
from datetime import datetime


auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Customer Registration
@auth_bp.route('/customer/register', methods=['POST'])
def customer_register ():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    customer = Customer.query.filter_by(email=email).first()
    if customer:
        return jsonify({"error": "Customer already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_customer = Customer(email=email, password=hashed_password)
    db.session.add(new_customer)
    db.session.commit()

    access_token = create_access_token(identity=new_customer.id)
    return jsonify({
        "message": "Customer registered successfully",
        "access_token": access_token
    }), 201

# Customer Login
@auth_bp.route('/customer/login', methods=['POST'])
def customer_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    customer = Customer.query.filter_by(email=email).first()
    if not customer or not bcrypt.check_password_hash(customer.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=customer.id)
    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200