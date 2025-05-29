#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, jsonify, request, session
from flask_migrate import Migrate
from flask_restful import Api, Resource

# Local imports
from config import app, db, api

# Add your model imports
from models import db, User

app = Flask(__name__)
app.secret_key = b'Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

# Views go here!

@app.route('/') 
def home():
    return '<h1>Trackletics</h1>'

class Login(Resource):
    def post(self):
        data = request.get_json()

        try: 
            username = data.get('username')

            new_user = User(username=username)
            db.session.add(new_user)
            db.session.commit()
            response_dict = new_user.to_dict()
            response = make_response(response_dict, 201)
            return response
        
        except (ValueError, TypeError) as e:
            return {'errors': ['validation errors']}, 400

api.add_resource(Login, '/login')

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401

        user = db.session.get(User, user_id)
        if not user:
            return {}, 401

        return user.to_dict(), 200

api.add_resource(CheckSession, '/check_session')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

