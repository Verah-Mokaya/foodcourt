from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify


# Password Helpers


def hash_password(password):
    return generate_password_hash(password)


def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)


# Role-Based Protection

def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):

            identity = get_jwt_identity()

            if not identity:
                return jsonify({"error": "Unauthorized"}), 401

            if identity.get("role") != required_role:
                return jsonify({"error": "Forbidden"}), 403

            return fn(*args, **kwargs)

        return wrapper
    return decorator


# Shortcuts

customer_required = role_required("customer")
outlet_required = role_required("outlet")
admin_required = role_required("admin")

import re


# VALIDATORS

def validate_email(email):

    if not email:
        return "Email is required"

    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if not re.match(pattern, email):
        return "Invalid email format"

    return None


def validate_password(password):

    if not password:
        return "Password is required"

    if len(password) < 6:
        return "Password must be at least 6 characters"

    return None


def validate_customer_data(data):

    required = [
        "email",
        "password",
        "first_name",
        "last_name"
    ]

    for field in required:
        if not data.get(field):
            return f"{field} is required"

    email_error = validate_email(data.get("email"))
    if email_error:
        return email_error

    password_error = validate_password(data.get("password"))
    if password_error:
        return password_error

    return None


def validate_outlet_data(data):

    required = [
        "outlet_name",
        "owner_name",
        "email",
        "password",
        "cuisine_type"
    ]

    for field in required:
        if not data.get(field):
            return f"{field} is required"

    email_error = validate_email(data.get("email"))
    if email_error:
        return email_error

    password_error = validate_password(data.get("password"))
    if password_error:
        return password_error

    return None
