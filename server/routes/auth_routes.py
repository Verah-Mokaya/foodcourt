from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from extensions import db, bcrypt
from models import Customer, Outlet

from utils import (
    validate_customer_data,
    validate_outlet_data,
    validate_email,
    validate_password,
    customer_required,
    outlet_required
)


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# CUSTOMER REGISTER
@auth_bp.route("/customer/register", methods=["POST"])
def customer_register():

    data = request.get_json() or {}

    # Use reusable validator
    error = validate_customer_data(data)
    if error:
        return jsonify({"error": error}), 400

    email = data["email"]

    if Customer.query.filter_by(email=email).first():
        return jsonify({"error": "Customer already exists"}), 409

    new_customer = Customer(
        email=email,
        password=data["password"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        phone_number=data.get("phone_number")
    )


    db.session.add(new_customer)
    db.session.commit()

    access_token = create_access_token(
        identity={
            "id": new_customer.id,
            "role": "customer"
        }
    )

    return jsonify({
        "message": "Customer registered successfully",
        "access_token": access_token
    }), 201


# CUSTOMER LOGIN
@auth_bp.route("/customer/login", methods=["POST"])
def customer_login():

    data = request.get_json() or {}

    email_error = validate_email(data.get("email"))
    if email_error:
        return jsonify({"error": email_error}), 400

    password_error = validate_password(data.get("password"))
    if password_error:
        return jsonify({"error": password_error}), 400

    customer = Customer.query.filter_by(
        email=data["email"]
    ).first()

    if not customer or not customer.authenticate(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity={
            "id": customer.id,
            "role": "customer"
        }
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200

# OUTLET REGISTER
@auth_bp.route("/outlet/register", methods=["POST"])
def outlet_register():

    data = request.get_json() or {}

    error = validate_outlet_data(data)
    if error:
        return jsonify({"error": error}), 400

    email = data["email"]

    if Outlet.query.filter_by(email=email).first():
        return jsonify({"error": "Outlet already exists"}), 409

    new_outlet = Outlet(
        outlet_name=data["outlet_name"],
        owner_name=data["owner_name"],
        email=email,
        password=data["password"],
        cuisine_type=data["cuisine_type"],
        description=data.get("description"),
        is_active=True
    )

    db.session.add(new_outlet)
    db.session.commit()

    access_token = create_access_token(
        identity={
            "id": new_outlet.id,
            "role": "outlet"
        }
    )

    return jsonify({
        "message": "Outlet registered successfully",
        "access_token": access_token
    }), 201


# OUTLET LOGIN
@auth_bp.route("/outlet/login", methods=["POST"])
def outlet_login():

    data = request.get_json() or {}

    email_error = validate_email(data.get("email"))
    if email_error:
        return jsonify({"error": email_error}), 400

    password_error = validate_password(data.get("password"))
    if password_error:
        return jsonify({"error": password_error}), 400

    outlet = Outlet.query.filter_by(
        email=data["email"]
    ).first()

    if not outlet or not outlet.authenticate(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity={
            "id": outlet.id,
            "role": "outlet"
        }
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200


# CURRENT USER
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():

    identity = get_jwt_identity()

    return jsonify({
        "user": identity
    }), 200

# RESET PASSWORD
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():

    data = request.get_json() or {}

    email = data.get("email")
    new_password = data.get("new_password")

    email_error = validate_email(email)
    if email_error:
        return jsonify({"error": email_error}), 400

    password_error = validate_password(new_password)
    if password_error:
        return jsonify({"error": password_error}), 400

    customer = Customer.query.filter_by(email=email).first()
    outlet = Outlet.query.filter_by(email=email).first()

    if not customer and not outlet:
        return jsonify({"error": "Account not found"}), 404

    hashed_password = bcrypt.generate_password_hash(
        new_password
    ).decode("utf-8")

    if customer:
        customer.password = hashed_password
    else:
        outlet.password = hashed_password

    db.session.commit()

    return jsonify({
        "message": "Password reset successful"
    }), 200


# LOGOUT
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():

    return jsonify({
        "message": "Logout successful. Delete token on client."
    }), 200
