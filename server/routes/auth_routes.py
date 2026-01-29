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

# outlet Registration
@auth_bp.route('/outlet/register', methods=['POST'])
def outlet_register ():
    data = request.get_json()
    outlet_name = data.get('outlet_name')
    owner_name = data.get('owner_name')
    email = data.get('email')
    password = data.get('password')
    cuisine_type = data.get('cuisine_type')

    if not all([outlet_name, owner_name, email, password, cuisine_type]):
        return jsonify({"error": "All fields are required"}), 400
    
    if Outlet.query.filter_by(email=email).first():
        return jsonify({"error": "Outlet with this email already exists"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_outlet = Outlet(
        outlet_name=outlet_name,
        owner_name=owner_name,
        email=email,
        password=hashed_password,
        cuisine_type=cuisine_type,
        description=data.get('description'),
        is_active=True,)
    
    db.session.add(new_outlet)
    db.session.commit()

    return jsonify({
        "message": "Outlet registered successfully",
        "outlet_id": new_outlet.id
    }), 201

# Outlet Login
@auth_bp.route('/outlet/login', methods=['POST'])
def outlet_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    outlet = Outlet.query.filter_by(email=email).first()
    if not outlet or not bcrypt.check_password_hash(outlet.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=outlet.id)
    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200

       # get current user info
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    return get_jwt_identity(), 200

# Password Reset (for both Customer and Outlet)
@auth_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({"error": "Email and new password are required"}), 400

    customer = Customer.query.filter_by(email=email).first()
    outlet = Outlet.query.filter_by(email=email).first()

    if not customer and not outlet:
        return jsonify({"error": "No account found with this email"}), 404

    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    if customer:
        customer.password = hashed_password
    else:
        outlet.password = hashed_password

    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200

# logout
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({"message": "Logout successful"}), 200