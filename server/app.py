from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from models import db, bcrypt
from routes.auth import Register, Login, Logout

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///foodcourt.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key'


db.init_app(app)
bcrypt.init_app(app)
Migrate(app, db)
CORS(app)

api = Api(app)
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

@app.route('/')
def home():
    return '<h1>Food Court API</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
