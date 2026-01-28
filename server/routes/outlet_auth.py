from flask import Blueprint, request, jsonify
from app import db, bcrypt
from models import Outlet

outlet_auth = Blueprint('outlet_auth', __name__)

@outlet_auth.route('/api/outlet/register', methods=['POST'])
def register_outlet():
    data = request.get_json()

    if Outlet.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Outlet already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(
        data['password']
        ).decode('utf-8')
    
    new_outlet = Outlet(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        cuisine=data.get('cuisine'),
        is_active=True
    )   
    db.session.add(new_outlet)
    db.session.commit() 

    return jsonify({'message': 'Outlet registered successfully',
                    "outlet_id": new_outlet.id
                    }), 201
    

@outlet_auth.route('/api/outlet/login', methods=['POST'])
def login_outlet():
    data = request.get_json()
    outlet = Outlet.query.filter_by(email=data['email']).first()

    if outlet and bcrypt.check_password_hash(outlet.password, data['password']):
        return jsonify({'message': 'Login successful',
                        'outlet_id': outlet.id
                        }), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401