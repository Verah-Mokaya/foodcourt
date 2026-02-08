from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from datetime import datetime, timedelta

from extensions import db
from models import Reservation, FoodCourtTable

from utils import customer_required, outlet_required


reservation_bp = Blueprint(
    "reservations",
    __name__,
    url_prefix="/reservations"
)


# GET TABLES (PUBLIC)
@reservation_bp.route("/food_court_tables", methods=["GET"])
def get_tables():
    outlet_id = request.args.get("outlet_id")
    date_str = request.args.get("date")
    time_str = request.args.get("time")

    query = FoodCourtTable.query
    if outlet_id:
        query = query.filter_by(outlet_id=outlet_id)
    
    tables = query.all()
    
    # If date and time are provided, check availability
    if date_str and time_str:
        try:
            target_time = datetime.fromisoformat(f"{date_str}T{time_str}:00")
            duration = timedelta(hours=1)
            end_target = target_time + duration
            
            for table in tables:
                # Check for confirmed/pending reservations in this window
                overlapping = Reservation.query.filter(
                    Reservation.table_id == table.id,
                    Reservation.status.in_(["pending", "confirmed"]),
                    Reservation.time_reserved_for < end_target,
                    Reservation.end_time > target_time
                ).first()
                if overlapping:
                    table.is_available = False
        except ValueError:
            pass # Invalid format, skip availability check

    return jsonify([
        {
            "id": t.id,
            "table_number": t.table_number,
            "capacity": t.capacity,
            "is_available": t.is_available,
            "outlet_id": t.outlet_id
        } for t in tables
    ]), 200


# CREATE RESERVATION (CUSTOMER ONLY)

@reservation_bp.route("", methods=["POST"])
@jwt_required()
@customer_required
def create_reservation():

    data = request.get_json() or {}

    required = ["outlet_id", "table_id", "time_reserved_for", "number_of_guests"]

    for field in required:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    identity = get_jwt_identity()
    customer_id = identity["id"]

    # Validate datetime
    try:
        time_reserved_for = datetime.fromisoformat(
            data["time_reserved_for"].replace("Z", "+00:00")
        )
        if time_reserved_for.replace(tzinfo=None) < datetime.utcnow():
            return jsonify({
                "error": "Cannot book for a past date or time"
            }), 400
    except ValueError:
        return jsonify({
            "error": "Invalid time_reserved_for format"
        }), 400

    # Validate table
    table = FoodCourtTable.query.get(data["table_id"])
    if not table:
        return jsonify({"error": "Table not found"}), 404

    # Validate outlet
    outlet_id = data.get("outlet_id")
    # Table must belong to the context of the outlet (not explicitly modeled but assumed for flow)

    # Time-based availability check (Block overlapping bookings on SAME TABLE in SAME OUTLET)
    # The requirement says "Table 1 is booked... If Customer B attempts to book THE SAME TABLE..."
    # We'll use a 1-hour window if end_time isn't provided, or calculate end_time.
    duration = timedelta(hours=1)
    end_time = time_reserved_for + duration
    
    # Check for overlaps
    overlapping = Reservation.query.filter(
        Reservation.table_id == table.id,
        Reservation.outlet_id == outlet_id,
        Reservation.status.in_(["pending", "confirmed"]),
        # Overlap logic: (StartA < EndB) and (EndA > StartB)
        Reservation.time_reserved_for < end_time,
        Reservation.end_time > time_reserved_for
    ).first()
    
    if overlapping:
        return jsonify({
            "error": f"Table {table.table_number} is already reserved between {overlapping.time_reserved_for.strftime('%H:%M')} and {overlapping.end_time.strftime('%H:%M')}. Please select another table or time."
        }), 400

    # Validate guests
    try:
        guests = int(data["number_of_guests"])
        if guests < 1 or guests > 6:
            return jsonify({
                "error": "Number of guests must be between 1 and 6"
            }), 400
    except ValueError:
        return jsonify({
            "error": "Invalid number_of_guests"
        }), 400

    reservation = Reservation(
        customer_id=customer_id,
        outlet_id=outlet_id,
        table_id=table.id,
        time_reserved_for=time_reserved_for,
        end_time=end_time,
        number_of_guests=guests,
        status="pending",
        reservation_fee=5.00
    )

    db.session.add(reservation)
    db.session.commit()

    return jsonify({
        "message": "Reservation created",
        "reservation_id": reservation.id
    }), 201


# GET SINGLE RESERVATION (OWNER ONLY)

@reservation_bp.route("/<int:reservation_id>", methods=["GET"])
@jwt_required()
def get_reservation(reservation_id):

    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    identity = get_jwt_identity()
    user_id = identity["id"]
    role = str(identity.get("role", "")).lower()

    # Ownership check
    if role == "customer" and reservation.customer_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify({
        "id": reservation.id,
        "table_id": reservation.table_id,
        "outlet_id": reservation.outlet_id,
        "outlet_name": reservation.outlet.outlet_name if reservation.outlet else "Unknown Outlet",
        "table_number": reservation.table.table_number if reservation.table else None,
        "time_reserved_for": reservation.time_reserved_for.isoformat(),
        "end_time": reservation.end_time.isoformat() if reservation.end_time else None,
        "number_of_guests": reservation.number_of_guests,
        "status": reservation.status,
        "reservation_fee": float(reservation.reservation_fee),
        "is_fee_deducted": reservation.is_fee_deducted,
        "is_reassigned": reservation.is_reassigned,
        "previous_table_number": reservation.previous_table_number,
        "created_at": reservation.created_at.isoformat() if reservation.created_at else None
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
                "outlet_id": r.outlet_id,
                "outlet_name": r.outlet.outlet_name if r.outlet else "Unknown Outlet",
                "table_number": r.table.table_number if r.table else None,
                "time_reserved_for": r.time_reserved_for.isoformat(),
                "number_of_guests": r.number_of_guests,
                "status": r.status,
                "is_reassigned": r.is_reassigned,
                "previous_table_number": r.previous_table_number,
                "created_at": r.created_at.isoformat()
                if r.created_at else None
            }
            for r in reservations
        ]
    }), 200


# UPDATE STATUS (CUSTOMER: CANCEL ONLY, OUTLET: ANY)

@reservation_bp.route("/<int:reservation_id>/status", methods=["PUT", "PATCH"])
@jwt_required()
def update_reservation_status(reservation_id):

    data = request.get_json() or {}
    status = data.get("status")
    
    if not status:
        return jsonify({"error": "Status is required"}), 400

    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    identity = get_jwt_identity()
    user_id = identity["id"]
    role = str(identity.get("role", "")).lower()

    # Ownership / Permissions
    if role == "customer":
        if reservation.customer_id != user_id:
            return jsonify({"error": "Forbidden"}), 403
        if status != "canceled":
            return jsonify({"error": "Customers can only cancel reservations"}), 403
    elif role not in ["outlet", "owner"]:
        return jsonify({"error": "Forbidden"}), 403

    reservation.status = status
    db.session.commit()

    return jsonify({
        "message": f"Reservation {status}",
        "reservation_id": reservation.id,
        "status": reservation.status
    }), 200


# CONFIRM RESERVATION (AFTER PAYMENT)
@reservation_bp.route("/<int:reservation_id>/confirm", methods=["PUT", "PATCH"])
@jwt_required()
def confirm_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404
        
    identity = get_jwt_identity()
    if reservation.customer_id != identity["id"]:
        return jsonify({"error": "Forbidden"}), 403
        
    if reservation.status != "pending":
        return jsonify({"error": f"Cannot confirm reservation in {reservation.status} status"}), 400
        
    reservation.status = "confirmed"
    db.session.commit()
    
    return jsonify({
        "message": "Reservation confirmed successfully",
        "reservation_id": reservation.id,
        "status": reservation.status
    }), 200


# REASSIGN TABLE (OUTLET ONLY)
@reservation_bp.route("/<int:reservation_id>/reassign", methods=["PUT", "PATCH"])
@jwt_required()
@outlet_required
def reassign_reservation(reservation_id):
    data = request.get_json() or {}
    new_table_id = data.get("new_table_id")
    
    if not new_table_id:
        return jsonify({"error": "new_table_id is required"}), 400
        
    res = Reservation.query.get(reservation_id)
    if not res:
        return jsonify({"error": "Reservation not found"}), 404
        
    new_table = FoodCourtTable.query.get(new_table_id)
    if not new_table:
        return jsonify({"error": "Table not found"}), 404
        
    # Check if new table is available for that time
    start_time = res.time_reserved_for - timedelta(hours=1)
    end_time = res.time_reserved_for + timedelta(hours=1)
    overlapping = Reservation.query.filter(
        Reservation.table_id == new_table.id,
        Reservation.status.in_(["pending", "confirmed"]),
        Reservation.time_reserved_for >= start_time,
        Reservation.time_reserved_for <= end_time,
        Reservation.id != res.id
    ).first()
    
    if overlapping:
        return jsonify({"error": "New table already reserved for this time slot"}), 400

    # Track change for notification
    old_table = FoodCourtTable.query.get(res.table_id)
    res.previous_table_number = old_table.table_number if old_table else None
    res.table_id = new_table.id
    res.is_reassigned = True
    
    db.session.commit()
    return jsonify({
        "message": "Table reassigned successfully",
        "new_table_number": new_table.table_number
    }), 200


# GET ALL RESERVATIONS (OUTLET OWNER ONLY)
@reservation_bp.route("", methods=["GET"])
@jwt_required()
def get_all_reservations():
    identity = get_jwt_identity()
    role = str(identity.get("role", "")).lower()

    if role not in ["outlet", "owner"]:
        return jsonify({"error": "Forbidden"}), 403

    reservations = Reservation.query.order_by(Reservation.time_reserved_for.desc()).all()

    return jsonify([
        {
            "id": r.id,
            "customer_id": r.customer_id,
            "table_id": r.table_id,
            "outlet_name": r.outlet.outlet_name if r.outlet else "Unknown Outlet",
            "table_number": r.table.table_number if r.table else None,
            "time_reserved_for": r.time_reserved_for.isoformat(),
            "number_of_guests": r.number_of_guests,
            "status": r.status,
            "is_reassigned": r.is_reassigned,
            "previous_table_number": r.previous_table_number,
            "created_at": r.created_at.isoformat() if r.created_at else None
        } for r in reservations
    ]), 200