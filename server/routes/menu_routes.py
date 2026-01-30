from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models.menu_item import MenuItem
from server.models.outlet import Outlet
from flask_jwt_extended import jwt_required

menu_bp = Blueprint('menu', __name__, url_prefix='/menu')

# Get Menu Items for an Outlet with optional filters
@menu_bp.route('/<int:outlet_id>', methods=['GET'])
def get_outlet_menu(outlet_id):
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
                    'is_available': item.is_available,
                    'created_at': item.created_at.isoformat(),
                }
                for item in items
            ]
        }, 200

    except Exception as e:
        return {'error': str(e)}, 500
    
# get single menu
@menu_bp.route('/item/<int:item_id>', methods=['GET'])
def get_menu_item(item_id):
    try:
        item = MenuItem.query.get(item_id)
        if not item:
            return {'error': 'Menu item not found'}, 404

        return {
            'id': item.id,
            'item_name': item.item_name,
            'description': item.description,
            'category': item.category,
            'price': float(item.price),
            'image_url': item.image_url,
            'is_available': item.is_available,
            'created_at': item.created_at.isoformat(),
            'outlet_id': item.outlet_id
        }, 200

    except Exception as e:
        return {'error': str(e)}, 500
    
# create menu item
@menu_bp.route('/item', methods=['POST'])
@jwt_required()
def create_menu_item():
    try:
        data = request.get_json()
        required_fields = ['outlet_id', 'item_name', 'price', 'category']

        for field in required_fields:
            if field not in data:
                return {'error': f'Missing required field: {field}'}, 400

        outlet = Outlet.query.get(data['outlet_id'])
        if not outlet:
            return {'error': 'Outlet not found'}, 404

        new_item = MenuItem(
            outlet_id=data['outlet_id'],
            item_name=data['item_name'],
            description=data.get('description'),
            category=data['category'],
            price=data['price'],
            image_url=data.get('image_url'),
            is_available=data.get('is_available', True)
        )

        db.session.add(new_item)
        db.session.commit()

        return {
            'message': 'Menu item created successfully',
            'item_id': new_item.id
        }, 201

    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    
# update menu item
@menu_bp.route('/item/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_menu_item(item_id):
    try:
        item = MenuItem.query.get(item_id)
        if not item:
            return {'error': 'Menu item not found'}, 404

        data = request.get_json()

        for key in ['item_name', 'description', 'category', 'price', 'image_url', 'is_available']:
            if key in data:
                setattr(item, key, data[key])

        db.session.commit()

        return {'message': 'Menu item updated successfully'}, 200

    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    
# get category list for an outlet
@menu_bp.route('/categories/<int:outlet_id>', methods=['GET'])
def get_menu_categories(outlet_id):
    try:
        outlet = Outlet.query.get(outlet_id)
        if not outlet:
            return {'error': 'Outlet not found'}, 404
        
        categories = db.session.query(MenuItem.category).filter_by(outlet_id=outlet_id).distinct().all()
        category_list = [category[0] for category in categories]

        return {
            'outlet_id': outlet_id,
            'outlet_name': outlet.outlet_name,
            'categories': category_list
        }, 200