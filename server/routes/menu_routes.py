from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models.menu_item import MenuItem
from server.models.outlet import Outlet
from flask_jwt_extended import jwt_required

menu_bp = Blueprint('menu', __name__, url_prefix='/menu')

@menu_bp.route('/<int:outlet_id>', methods=['GET'])
def get_outlet_menu(outlet_id):
    """Get menu items for an outlet"""
    try:
        outlet = Outlet.query.get(outlet_id)
        if not outlet:
            return {'error': 'Outlet not found'}, 404

        category = request.args.get('category')
        is_available = request.args.get('is_available')

        query = MenuItem.query.filter_by(outlet_id=outlet_id)

        if category:
            query = query.filter_by(category=category)

        if is_available is not None:
            is_available = is_available.lower() == 'true'
            query = query.filter_by(is_available=is_available)

        items = query.all()

        return {
            'outlet_id': outlet_id,
            'outlet_name': outlet.outlet_name,
            'items': [
                {
                    'id': item.id,
                    'item_name': item.item_name,
                    'description': item.description,
                    'category': item.category,
                    'price': float(item.price),
                    'image_url': item.image_url,
                    'is_available': item.is_available
                }
                for item in items
            ]
        }, 200

    except Exception as e:
        return {'error': str(e)}, 500
