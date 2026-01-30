from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify


# -----------------------
# Password Helpers
# -----------------------

def hash_password(password):
    return generate_password_hash(password)


def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)


# -----------------------
# Role-Based Protection
# -----------------------

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


# -----------------------
# Shortcuts
# -----------------------

customer_required = role_required("customer")
outlet_required = role_required("outlet")
