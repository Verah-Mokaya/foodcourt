from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
})

db = SQLAlchemy(metadata=metadata)


class Customer(db.Model, SerializerMixin):
    __tablename__ = "customers"
    serialize_rules = ("-orders.customer", "-table_bookings.customer")
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    orders = db.relationship("Order", back_populates="customer", cascade="all, delete-orphan")
    table_bookings = db.relationship("TableBooking", back_populates="customer", cascade="all, delete-orphan")
    
    # validations
    @validates("email")
    def validate_email(self, key, value):
        if "@" not in value or "." not in value:
            raise ValueError("Invalid email address")
        return value.lower()
    
    @validates("first_name", "last_name")
    def validate_name(self, key, value):
        if not value or len(value.strip()) == 0:
            raise ValueError(f"{key} cannot be empty")
        return value.strip()
    
    def __repr__(self):
        return f"<Customer id={self.id} email={self.email}>"


class Outlet(db.Model, SerializerMixin):
    __tablename__ = "outlets"
    serialize_rules = ("-menu_items.outlet",)
    
    id = db.Column(db.Integer, primary_key=True)
    owner_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(255))
    outlet_name = db.Column(db.String(100), nullable=False)
    cuisine_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    menu_items = db.relationship("MenuItem", back_populates="outlet", cascade="all, delete-orphan")
    
    # validations
    @validates("email")
    def validate_email(self, key, value):
        if value and ("@" not in value or "." not in value):
            raise ValueError("Invalid email address")
        return value.lower() if value else None
    
    @validates("cuisine_type")
    def validate_cuisine_type(self, key, value):
        valid_cuisines = ["Ethiopian", "Nigerian", "Congolese", "Kenyan", "Indian", "Chinese", "Italian", "Mexican", "Other"]
        if value not in valid_cuisines:
            raise ValueError(f"cuisine_type must be one of {valid_cuisines}")
        return value
    
    @validates("outlet_name", "owner_name")
    def validate_name(self, key, value):
        if not value or len(value.strip()) == 0:
            raise ValueError(f"{key} cannot be empty")
        return value.strip()
    
    def __repr__(self):
        return f"<Outlet id={self.id} name={self.outlet_name}>"


class MenuItem(db.Model, SerializerMixin):
    __tablename__ = "menu_items"
    serialize_rules = ("-outlet.menu_items", "-order_items.menu_item")
    
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey("outlets.id"), nullable=False)
    outlet_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255))
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    outlet = db.relationship("Outlet", back_populates="menu_items")
    order_items = db.relationship("OrderItem", back_populates="menu_item", cascade="all, delete-orphan")
    
    # validations
    @validates("price")
    def validate_price(self, key, value):
        if value <= 0:
            raise ValueError("Price must be greater than zero")
        return value
    
    @validates("category")
    def validate_category(self, key, value):
        valid_categories = ["kids", "snack", "main", "appetizer", "dessert", "beverage", "other"]
        if value.lower() not in valid_categories:
            raise ValueError(f"category must be one of {valid_categories}")
        return value.lower()
    
    @validates("item_name", "outlet_name")
    def validate_name(self, key, value):
        if not value or len(value.strip()) == 0:
            raise ValueError(f"{key} cannot be empty")
        return value.strip()
    
    def __repr__(self):
        return f"<MenuItem id={self.id} name={self.item_name}>"

