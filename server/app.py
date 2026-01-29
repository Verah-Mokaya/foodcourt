from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from models import db, bcrypt

app = Flask(__name__)
# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///foodcourt.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key'

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)
Migrate(app, db)
CORS(app)

api = Api(app)

@app.route('/')
def home():
    return '<h1>Food Court API</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
