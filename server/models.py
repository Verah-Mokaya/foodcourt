import re

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

from datetime import datetime
from extensions import db, bcrypt


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
})


class Customer(db.Model, SerializerMixin):
    __tablename__ = "customers"
    serialize_rules = ("-reservations.customer",)
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password = db.Column("password", db.String, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    reservations = db.relationship("Reservation", back_populates="customer", cascade="all, delete-orphan")
    
    # password hashing
    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password, password.encode('utf-8'))
    
    @validates("password")
    def validate_password(self, key, password):
        if not password:
             return None
        return bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    # validations
    @validates("email")
    def validate_email(self, key, value):
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("Invalid email address")
        return value.lower().strip()
    
    @validates("first_name", "last_name")
    def validate_name(self, key, value):
        if not value or len(value.strip()) < 2:
            raise ValueError(f"{key} must be at least 2 characters")
        return value.strip()
    
    @validates("phone_number")
    def validate_phone(self, key, value):
        if value and not re.match(r"^\+?[\d\s\-()]+$", value):
            raise ValueError("Invalid phone number format")
        return value.strip() if value else value
    
    def __repr__(self):
        return f"<Customer id={self.id} email={self.email}>"


class Outlet(db.Model, SerializerMixin):
    __tablename__ = "outlets"
    serialize_rules = ("-menu_items.outlet",)
    
    id = db.Column(db.Integer, primary_key=True)
    owner_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    password = db.Column(db.String)
    outlet_name = db.Column(db.String(100), nullable=False)
    cuisine_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    menu_items = db.relationship("MenuItem", back_populates="outlet", cascade="all, delete-orphan")

    # password hashing
    @validates("password")
    def validate_password(self, key, password):
        if not password:
             return None
        return bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password, password.encode('utf-8'))
    
    # validations
    @validates("email")
    def validate_email(self, key, value):
        if value and ("@" not in value or "." not in value.split("@")[-1]):
            raise ValueError("Invalid email address")
        return value.lower().strip() if value else value
    
    @validates("owner_name", "outlet_name")
    def validate_names(self, key, value):
        if not value or len(value.strip()) < 2:
            raise ValueError(f"{key} must be at least 2 characters")
        return value.strip()
    
    def __repr__(self):
        return f"<Outlet id={self.id} name={self.outlet_name}>"


class MenuItem(db.Model, SerializerMixin):
    __tablename__ = "menu_items"
    serialize_rules = ("-outlet.menu_items", "-order_items.menu_item")
    
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey("outlets.id"), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255))
    time_to_prepare = db.Column(db.Integer, nullable=False, default=15)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    outlet = db.relationship("Outlet", back_populates="menu_items")
    order_items = db.relationship("OrderItem", back_populates="menu_item", cascade="all, delete-orphan")
    
    @validates("item_name")
    def validate_item_name(self, key, value):
        if not value or len(value.strip()) < 2:
            raise ValueError("item_name must be at least 2 characters")
        return value.strip()
    
    def __repr__(self):
        return f"<MenuItem id={self.id} name={self.item_name}>"


class FoodCourtTable(db.Model, SerializerMixin):
    __tablename__ = "food_court_tables"
    serialize_rules = ("-reservations.table",)
    
    id = db.Column(db.Integer, primary_key=True)
    table_number = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    reservations = db.relationship("Reservation", back_populates="table", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<FoodCourtTable id={self.id} number={self.table_number}>"


class Reservation(db.Model, SerializerMixin):
    __tablename__ = "reservations"
    serialize_rules = ("-customer.reservations", "-table.reservations", "-orders.reservation")
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    time_reserved_for = db.Column(db.DateTime, nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey("food_court_tables.id"), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    customer = db.relationship("Customer", back_populates="reservations")
    table = db.relationship("FoodCourtTable", back_populates="reservations")
    orders = db.relationship("Order", back_populates="reservation", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Reservation id={self.id} customer_id={self.customer_id} table_id={self.table_id}>"


class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"
    serialize_rules = ("-reservation.orders", "-order_items.order")
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    reservation_id = db.Column(db.Integer, db.ForeignKey("reservations.id"))
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="pending")
    estimated_time = db.Column(db.String(20)) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    customer = db.relationship("Customer", back_populates="orders")
    reservation = db.relationship("Reservation", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    
    def calculate_estimated_time(self):
        if not self.order_items:
            self.estimated_time = "15-25 minutes"  # default
            return
        
        max_prep_time = max(
            (item.time_to_prepare for item in self.order_items if item.time_to_prepare),
            default=15
        )
        
        # the range
        min_time = max_prep_time
        max_time = max_prep_time + 10
        
        self.estimated_time = f"{min_time}-{max_time} minutes"
    
    def __repr__(self):
        return f"<Order id={self.id} total={self.total_amount} status={self.status}>"


class OrderItem(db.Model, SerializerMixin):
    __tablename__ = "order_items"
    serialize_rules = ("-order.order_items", "-menu_item.order_items")
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    time_to_prepare = db.Column(db.Integer)
    
    # relationships
    order = db.relationship("Order", back_populates="order_items")
    menu_item = db.relationship("MenuItem", back_populates="order_items")
    
    def __repr__(self):
        return f"<OrderItem id={self.id} order_id={self.order_id} qty={self.quantity}>"