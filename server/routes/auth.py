from flask import request, make_response, jsonify
from flask_restful import Resource
from models import db, Customer, Outlet
import jwt
import datetime
from flask import current_app

class Register(Resource):
    def post(self):
        data = request.get_json()
        
        # check for required fields
        if not data or not data.get('email') or not data.get('password') or not data.get('first_name'):
             return make_response(jsonify({"error": "Missing required fields"}), 400)
             
        if Customer.query.filter_by(email=data['email']).first():
            return make_response(jsonify({"error": "Email already exists"}), 400)
            
        try:
            new_customer = Customer(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                password=data['password'],
                phone_number=data.get('phone_number')
            )
            db.session.add(new_customer)
            db.session.commit()
            
            # Generate token
            token = jwt.encode({
                'user_id': new_customer.id,
                'role': 'customer',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
            
            return make_response(jsonify({"token": token, "user": new_customer.to_dict()}), 201)
            
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)

class Login(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return make_response(jsonify({"error": "Missing email or password"}), 400)
            
        email = data['email']
        password = data['password']
        
        # Check Customer
        customer = Customer.query.filter_by(email=email).first()
        if customer and customer.authenticate(password):
            token = jwt.encode({
                'user_id': customer.id,
                'role': 'customer',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
            return make_response(jsonify({"token": token, "role": "customer", "user": customer.to_dict()}), 200)
            
        # Check Outlet (Owner)
        outlet = Outlet.query.filter_by(email=email).first()
        if outlet and outlet.authenticate(password):
            token = jwt.encode({
                'user_id': outlet.id,
                'role': 'outlet',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, current_app.config['SECRET_KEY'], algorithm="HS256")
            return make_response(jsonify({"token": token, "role": "outlet", "user": outlet.to_dict()}), 200)
            
        return make_response(jsonify({"error": "Invalid credentials"}), 401)
