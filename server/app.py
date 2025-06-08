from flask import Flask, make_response, jsonify, request, session
from flask_restful import Resource, Api
from config import create_app, db
from flask_migrate import Migrate
from models import User, Workout, HealthStat

app = create_app()
api = Api(app)
migrate = Migrate(app, db)

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
            session['user_id'] = new_user.id
            response_dict = new_user.to_dict()
            return make_response(response_dict, 201)
        except (ValueError, TypeError) as e:
            return {'errors': ['validation errors']}, 400

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204

api.add_resource(Logout, '/logout')

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

class Workouts(Resource):
    def get(self):
        workout_list = [w.to_dict() for w in Workout.query.all()]
        response = make_response(workout_list, 200)
        return response

    def post(self):
        data = request.get_json()
        try:
            name = data.get('name')
            category = data.get('category')
            difficulty = data.get('difficulty')

            new_workout = Workout(name=name, category=category, difficulty=difficulty)
            db.session.add(new_workout)
            db.session.commit()
            response_dict = new_workout.to_dict()
            response = make_response(response_dict, 201)
            return response
        except (ValueError, TypeError) as e:
            return {"errors": ["validation errors"]}, 400

api.add_resource(Workouts, '/workouts')

class HealthStats(Resource):
    def get(self):
        health_stat_list = [h.to_dict() for h in HealthStat.query.all()]
        response = make_response(health_stat_list, 200)
        return response

api.add_resource(HealthStats, '/health_stats')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
