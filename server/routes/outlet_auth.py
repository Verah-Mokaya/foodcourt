from flask import Blueprint, request, jsonify
from app import db, bcrypt
from models import Outlet

outlet_auth = Blueprint('outlet_auth', __name__)

@outlet_auth.route('/api/outlet/register', methods=['POST'])
def register_outlet():
    data = request.get_json()
