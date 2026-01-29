@reservation_bp.route("/", methods=["POST"])
@jwt_required()
def create_reservation():
    data = request.json

    reservation = Reservation(
        customer_id=data["customer_id"],
        table_id=data["table_id"],
        time_reserved_for=data["time_reserved_for"],
        status="pending"
    )

    db.session.add(reservation)
    db.session.commit()

    return jsonify(message="Reservation created"), 201
