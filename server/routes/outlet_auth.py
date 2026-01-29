from flask import Blueprint, request, jsonify
from models import Outlet
from extensions import db, bcrypt
from flask_jwt_extended import create_access_token

outlet_auth = Blueprint('outlet_auth', __name__)

# Outlet Registration Route 
@outlet_auth.route('/api/outlets/register', methods=['POST'])
def register_outlet():
    data = request.get_json()

    if Outlet.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Outlet already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(
        data['password']
        ).decode('utf-8')
    
    new_outlet = Outlet(
        owner_name=data["owner_name"],
        outlet_name=data["outlet_name"],
        email=data["email"],
        password=hashed_password,
        cuisine_type=data["cuisine_type"],
        description=data.get("description"),
        is_active=True
    )   
    db.session.add(new_outlet)
    db.session.commit() 

    return jsonify({
        "message": "Outlet registered successfully",
        "outlet_id": new_outlet.id
                    }), 201
    
# Outlet Login Route
@outlet_auth.route('/api/outlets/login', methods=['POST'])
def login_outlet():
    data = request.get_json()

    outlet = Outlet.query.filter_by(email=data['email']).first()

    if not outlet.is_active:
        return jsonify({'message': 'Invalid credentials'}), 401

    if not bcrypt.check_password_hash(outlet.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    if not outlet.is_active:
        return jsonify({'message': 'Outlet is inactive'}), 403
    
    token = create_access_token(identity=outlet.id)

    return jsonify({
        "token": token,
        "new_outlet": {
            "id": outlet.id,
            "owner_name": outlet.owner_name,
            "outlet_name": outlet.outlet_name,
            "email": outlet.email,
            "cuisine_type": outlet.cuisine_type,
        }
    }), 200