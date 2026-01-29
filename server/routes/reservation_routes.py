from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from server.extensions import db
from server.models.reservation import Reservation
from server.models.food_court_table import FoodCourtTable

reservations_bp = Blueprint("reservations", __name__, url_prefix="/reservations")

@reservation_bp.route("/", methods=["POST"])
@jwt_required()
def create_reservation():

    try:
        data=request.get_json()
        customer_id = get_jwt_identity()["customer_id"]

        required_fields = ["table_id", "reservation_time", "number_of_guests"]

        if not all(field in data for field in required_fields):
            return {"error": "Missing required fields"}, 400
        
        table = FoodCourtTable.query.get(data["table_id"])
        if not table:
            return {"error": "Table not found"}, 404
        
        if not table.is_available:
            return {"error": "Table is not available"}, 400
        
        db.session.add(
            Reservation(
                customer_id=customer_id,
                table_id=data["table_id"],
                reservation_time=datetime.fromisoformat(data["reservation_time"]),
                number_of_guests=data["number_of_guests"],
                status="booked"
            )
        )
        table.is_available = False  # Mark table as unavailable
        db.session.commit()
        
        return {"message": "Reservation created successfully"}, 201
        
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
    
# get single reservation
@reservation_bp.route("/<int:reservation_id>", methods=["GET"])
@jwt_required()
def get_reservation(reservation_id):
    try:
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        
        return {
            "id": reservation.id,
            "customer_id": reservation.customer_id,
            "table_id": reservation.table_id,
            "reservation_time": reservation.reservation_time.isoformat(),
            "number_of_guests": reservation.number_of_guests,
            "status": reservation.status,
            "created_at": reservation.created_at.isoformat()
        }, 200
    
    except Exception as e:
        return {"error": str(e)}, 500