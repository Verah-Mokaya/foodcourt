from app import db

class Outlet(db.Model):
    __tablename__ = 'outlets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    cuisine = db.Column(db.String(80))
    is_active = db.Column(db.Boolean, default=True)

