@order_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():
    data = request.json

    order = Order(
        reservation_id=data["reservation_id"],
        total_amount=0,
        status="pending"
    )

    db.session.add(order)
    db.session.commit()

    return jsonify(message="Order created"), 201
