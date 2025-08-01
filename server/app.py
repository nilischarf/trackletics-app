from flask import Flask, make_response, jsonify, request, session
from flask_cors import CORS
from flask_restful import Resource, Api
from config import create_app, db
from flask_migrate import Migrate
from models import User, Workout, HealthStat

app = create_app()
CORS(app, supports_credentials=True)
api = Api(app)
migrate = Migrate(app, db)

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {"error": "Username and password required."}, 400

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return {"error": "Username already exists."}, 400

        try:
            new_user = User(username=username)
            new_user.password_hash = password
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id 
            return new_user.to_dict(), 201
        except Exception as e:
            print("Signup Error:", e)
            return {"error": "Signup failed."}, 500
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {"error": "Username and password required."}, 400

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id

            workout_dict = {}
            for stat in user.health_stats:
                w_id = stat.workout_id
                if w_id not in workout_dict:
                    workout_dict[w_id] = {
                        **stat.workout.to_dict(),
                        "health_stats": []
                    }
                workout_dict[w_id]["health_stats"].append(stat.to_dict())

            user_data = user.to_dict()
            user_data["workouts"] = list(workout_dict.values())

            return user_data, 200

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401

        user = db.session.get(User, user_id)
        if not user:
            return {"error": "User not found."}, 401

        user_stats = HealthStat.query.filter_by(user_id=user.id).all()

        workout_dict = {}
        for stat in user_stats:
            w_id = stat.workout_id
            if w_id not in workout_dict:
                workout_dict[w_id] = {
                    **stat.workout.to_dict(),
                    "health_stats": []
                }
            workout_dict[w_id]["health_stats"].append(stat.to_dict())

        user_data = user.to_dict()
        user_data["workouts"] = list(workout_dict.values())

        return user_data, 200 

class Workouts(Resource):
    def get(self):
        workout_list = [w.to_dict() for w in Workout.query.all()]
        response = make_response(workout_list, 200)
        return response

    def post(self):  
        data = request.get_json()
        try:
            new_workout = Workout(
                name = data.get('name'),
                category = data.get('category'),
                difficulty = int(data.get('difficulty'))
            )
            db.session.add(new_workout)
            db.session.commit()
            response_dict = new_workout.to_dict()
            response = make_response(response_dict, 201)
            return response
        except (ValueError, TypeError) as e:
            return {"errors": ["validation errors"]}, 400

class WorkoutByID(Resource):
    def get(self, workout_id):
        workout = db.session.get(Workout, workout_id)

        if not workout:
            return {"error": "Workout not found"}, 404

        response = make_response(workout.to_dict(), 200)
        return response
        
    def patch(self, workout_id):
        workout = Workout.query.filter_by(id=id).first()
        if not workout:
            return {"error": "Workout not found"}, 404

        data = request.get_json()
        try:
            if 'name' in data:
                workout.name = data['name']
            if 'category' in data:
                workout.category = data['category']
            if "difficulty" in data:
                workout.difficulty = int(data["difficulty"])
            db.session.commit()
            workout_dict = workout.to_dict(['name', 'category', 'difficulty'])
            response = make_response(workout_dict, 200)
            return response
        except ValueError:
            return {"errors": ["validation errors"]}, 400
        
    def delete(self, workout_id):
        workout = Workout.query.filter_by(id=id).first()
        if not workout:
            return {"error": "Workout not found"}, 404
        db.session.delete(workout)
        db.session.commit()
        response = make_response("", 204)
        return response

class HealthStats(Resource):
    def get(self):
        health_stat_list = [h.to_dict() for h in HealthStat.query.all()]
        response = make_response(health_stat_list, 200)
        return response

    def post(self):
        data = request.get_json()
        try: 
            calories_burned = int(data.get('calories_burned'))
            hydration = int(data.get('hydration'))
            soreness = int(data.get('soreness'))
            user_id = data.get('user_id')
            workout_id = data.get('workout_id')

            new_stat = HealthStat(
                calories_burned=calories_burned,
                hydration=hydration,
                soreness=soreness,
                user_id=user_id,
                workout_id=workout_id
            )
            db.session.add(new_stat)
            db.session.commit()

            response_dict = new_stat.to_dict()
            response = make_response(response_dict, 201)
            return response

        except (ValueError, TypeError) as e:
            return {"errors": ["validation errors"]}, 400

class HealthStatByID(Resource):
    def get(self, health_stat_id):
        health_stat = db.session.get(HealthStat, health_stat_id)

        if not health_stat:
            return {"error": "Health Stat not found"}, 404

        response = make_response(health_stat.to_dict(), 200)
        return response

    def patch(self, health_stat_id):
        health_stat = HealthStat.query.filter_by(id=health_stat_id).first()
        if not health_stat:
            return {"error": "HealthStat not found"}, 404

        data = request.get_json()
        try:
            if 'calories_burned' in data:
                health_stat.calories_burned = int(data["calories_burned"])
            if "hydration" in data:
                h = int(data["hydration"])
                health_stat.hydration = h
            if "soreness" in data:
                s = int(data["soreness"])
                health_stat.soreness = s
            db.session.commit()
            health_stat_dict = health_stat.to_dict()
            response = make_response(health_stat_dict, 200)
            return response
        except ValueError:
            return {"errors": ["validation errors"]}, 400
        
    def delete(self, health_stat_id):
        health_stat = HealthStat.query.filter_by(id=health_stat_id).first()
        if not health_stat:
            return {"error": "HealthStat not found"}, 404

        workout = Workout.query.filter_by(id=health_stat.workout_id).first()

        db.session.delete(health_stat)
        db.session.commit()

        remaining_stats = HealthStat.query.filter_by(workout_id=workout.id).count()

        if remaining_stats == 0 and workout is not None:
            db.session.delete(workout)
            db.session.commit()

        return make_response("", 204)

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Workouts, '/workouts')
api.add_resource(WorkoutByID, '/workouts/<int:workout_id>')
api.add_resource(HealthStats, '/health_stats')
api.add_resource(HealthStatByID, '/health_stats/<int:health_stat_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
