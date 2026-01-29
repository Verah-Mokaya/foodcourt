from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.menu_item import MenuItem
from app.extensions import db
from decimal import Decimal

from server.models import Outlet

menu_bp = Blueprint("menu", __name__)

@menu_bp.route('/<int:outlet_id>', methods=['GET'])
def get_menu_items(outlet_id):
    """Get menu items for an outlet by ID"""
    try: 
        outlet = Outlet.query.get(outlet_id)
        if not outlet:
            return jsonify(message="Outlet not found"), 404
        
        # get query paramenter for filtering by category
        category = request.args.get('category')
        min_price = request.args.get('min_price', type=Decimal)
        max_price = request.args.get('max_price', type=Decimal)
        is_available = request.args.get('is_available', type=lambda v: v.lower() == 'true' if v else None)

        query = MenuItem.query.filter_by(outlet_id=outlet_id)

        if category:
            query = query.filter_by(category=category)
        if min_price is not None:
            query = query.filter(MenuItem.price >= min_price)
        if max_price is not None:
            query = query.filter(MenuItem.price <= max_price)
        if is_available is not None:
            query = query.filter_by(is_available=is_available)
    
    items = query.all()
    
    return {
        'outlet_id': outlet_id,
        'outlet_name': outlet.name,
        'items': [
            {
                'id': item.id,
                'name': item.name,
                'description': item.description,
                'price': str(item.price),
                'category': item.category,
                'is_available': item.is_available
            } for item in items     
        ]
    }, 200
    except Exception as e:
        return jsonify(message=str(e)), 500
