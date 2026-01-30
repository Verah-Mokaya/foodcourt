from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from datetime import datetime

from extensions import db
from models import Reservation, FoodCourtTable

from utils import customer_required


reservation_bp = Blueprint(
    "reservations",
    __name__,
    url_prefix="/reservations"
)


# CREATE RESERVATION (CUSTOMER ONLY)

@reservation_bp.route("", methods=["POST"])
@jwt_required()
@customer_required
def create_reservation():

    data = request.get_json() or {}

    required = ["table_id", "reservation_time", "number_of_guests"]

    for field in required:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    identity = get_jwt_identity()
    customer_id = identity["id"]

    # Validate table
    table = FoodCourtTable.query.get(data["table_id"])

    if not table:
        return jsonify({"error": "Table not found"}), 404

    if not table.is_available:
        return jsonify({"error": "Table not available"}), 400

    # Validate datetime
    try:
        reservation_time = datetime.fromisoformat(
            data["reservation_time"]
        )
    except ValueError:
        return jsonify({
            "error": "Invalid reservation_time format"
        }), 400

    # Validate guests
    try:
        guests = int(data["number_of_guests"])
        if guests < 1:
            raise ValueError
    except ValueError:
        return jsonify({
            "error": "Invalid number_of_guests"
        }), 400

    reservation = Reservation(
        customer_id=customer_id,
        table_id=table.id,
        reservation_time=reservation_time,
        number_of_guests=guests,
        status="pending"
    )

    db.session.add(reservation)

    table.is_available = False

    db.session.commit()

    return jsonify({
        "message": "Reservation created",
        "reservation_id": reservation.id
    }), 201


# GET SINGLE RESERVATION (OWNER ONLY)

@reservation_bp.route("/<int:reservation_id>", methods=["GET"])
@jwt_required()
@customer_required
def get_reservation(reservation_id):

    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    identity = get_jwt_identity()

    # Ownership check
    if reservation.customer_id != identity["id"]:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify({
        "id": reservation.id,
        "table_id": reservation.table_id,
        "reservation_time": reservation.reservation_time.isoformat(),
        "number_of_guests": reservation.number_of_guests,
        "status": reservation.status,
        "created_at": reservation.created_at.isoformat()
        if reservation.created_at else None
    }), 200


# GET MY RESERVATIONS

@reservation_bp.route("/my", methods=["GET"])
@jwt_required()
@customer_required
def get_my_reservations():

    identity = get_jwt_identity()

    reservations = Reservation.query.filter_by(
        customer_id=identity["id"]
    ).all()

    return jsonify({
        "reservations": [
            {
                "id": r.id,
                "table_id": r.table_id,
                "reservation_time": r.reservation_time.isoformat(),
                "number_of_guests": r.number_of_guests,
                "status": r.status,
                "created_at": r.created_at.isoformat()
                if r.created_at else None
            }
            for r in reservations
        ]
    }), 200


# UPDATE STATUS (CUSTOMER: CANCEL ONLY)

@reservation_bp.route("/<int:reservation_id>/status", methods=["PUT"])
@jwt_required()
@customer_required
def update_reservation_status(reservation_id):

    data = request.get_json() or {}

    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    identity = get_jwt_identity()

    # Ownership
    if reservation.customer_id != identity["id"]:
