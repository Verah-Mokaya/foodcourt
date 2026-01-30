from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.extensions import db
from models import Outlet, Order, OrderItem, MenuItem
from sqlalchemy import func
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_overview():
    outlet_id = get_jwt_identity()
    
    # Get all orders for this outlet through menu items
    total_orders = db.session.query(func.count(func.distinct(Order.id)))\
        .join(OrderItem, Order.id == OrderItem.order_id)\
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .scalar()
    
    # Get total revenue
    total_revenue = db.session.query(func.sum(OrderItem.price * OrderItem.quantity))\
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .scalar() or 0
    
    # Get today's orders
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today = db.session.query(func.count(func.distinct(Order.id)))\
        .join(OrderItem, Order.id == OrderItem.order_id)\
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .filter(Order.created_at >= today_start)\
        .scalar()
    
    # Get today's revenue
    revenue_today = db.session.query(func.sum(OrderItem.price * OrderItem.quantity))\
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
        .join(Order, OrderItem.order_id == Order.id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .filter(Order.created_at >= today_start)\
        .scalar() or 0
    
    return jsonify({
        'total_orders': total_orders or 0,
        'total_revenue': float(total_revenue),
        'orders_today': orders_today or 0,
        'revenue_today': float(revenue_today)
    }), 200

