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


@analytics_bp.route('/orders/status', methods=['GET'])
@jwt_required()
def get_order_status_breakdown():
    outlet_id = get_jwt_identity()
    
    # Get order counts by status
    status_counts = db.session.query(Order.status, func.count(func.distinct(Order.id)))\
        .join(OrderItem, Order.id == OrderItem.order_id)\
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .group_by(Order.status)\
        .all()
    
    # Format the response
    breakdown = {status: count for status, count in status_counts}
    
    return jsonify({
        'pending': breakdown.get('pending', 0),
        'completed': breakdown.get('completed', 0),
        'cancelled': breakdown.get('cancelled', 0)
    }), 200


@analytics_bp.route('/popular-items', methods=['GET'])
@jwt_required()
def get_popular_items():
    outlet_id = get_jwt_identity()
    
    # Get top 10 menu items by quantity sold
    popular_items = db.session.query(
        MenuItem.item_name,
        func.sum(OrderItem.quantity).label('total_quantity'),
        func.sum(OrderItem.price * OrderItem.quantity).label('total_revenue')
    )\
        .join(OrderItem, MenuItem.id == OrderItem.menu_item_id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .group_by(MenuItem.id, MenuItem.item_name)\
        .order_by(func.sum(OrderItem.quantity).desc())\
        .limit(10)\
        .all()
    
    items_list = [
        {
            'item_name': item.item_name,
            'total_quantity': int(item.total_quantity),
            'total_revenue': float(item.total_revenue)
        }
        for item in popular_items
    ]
    
    return jsonify({'popular_items': items_list}), 200


@analytics_bp.route('/revenue/daily', methods=['GET'])
@jwt_required()
def get_daily_revenue():
    outlet_id = get_jwt_identity()
    
    # Get revenue for last 7 days
    daily_revenue = []
    for i in range(6, -1, -1):
        day_start = (datetime.utcnow() - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        revenue = db.session.query(func.sum(OrderItem.price * OrderItem.quantity))\
            .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
            .join(Order, OrderItem.order_id == Order.id)\
            .filter(MenuItem.outlet_id == outlet_id)\
            .filter(Order.created_at >= day_start)\
            .filter(Order.created_at < day_end)\
            .scalar() or 0
        
        daily_revenue.append({
            'date': day_start.strftime('%Y-%m-%d'),
            'revenue': float(revenue)
        })
    
    return jsonify({'daily_revenue': daily_revenue}), 200


@analytics_bp.route('/revenue/weekly', methods=['GET'])
@jwt_required()
def get_weekly_revenue():
    outlet_id = get_jwt_identity()
    
    # Current week (last 7 days)
    current_week_start = datetime.utcnow() - timedelta(days=7)
    current_week_revenue = db.session.query(func.sum(OrderItem.price * OrderItem.quantity))\
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
        .join(Order, OrderItem.order_id == Order.id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .filter(Order.created_at >= current_week_start)\
        .scalar() or 0
    
    # Previous week (8-14 days ago)
    previous_week_start = datetime.utcnow() - timedelta(days=14)
    previous_week_end = datetime.utcnow() - timedelta(days=7)
    previous_week_revenue = db.session.query(func.sum(OrderItem.price * OrderItem.quantity))\
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)\
        .join(Order, OrderItem.order_id == Order.id)\
        .filter(MenuItem.outlet_id == outlet_id)\
        .filter(Order.created_at >= previous_week_start)\
        .filter(Order.created_at < previous_week_end)\
        .scalar() or 0
    
    # Calculate growth
    if previous_week_revenue > 0:
        growth_percentage = ((current_week_revenue - previous_week_revenue) / previous_week_revenue) * 100
    else:
        growth_percentage = 0 if current_week_revenue == 0 else 100
    
    return jsonify({
        'current_week_revenue': float(current_week_revenue),
        'previous_week_revenue': float(previous_week_revenue),
        'growth_percentage': round(float(growth_percentage), 2)
    }), 200
