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
            difficulty = int(data.get('difficulty'))

            if not name or not category:
                raise ValueError("Name and category are required.")
            if difficulty < 1 or difficulty > 5:
                raise ValueError("Difficulty must be between 1 and 5.")

            new_workout = Workout(name=name, category=category, difficulty=difficulty)
            db.session.add(new_workout)
            db.session.commit()
            response_dict = new_workout.to_dict()
            response = make_response(response_dict, 201)
            return response
        except (ValueError, TypeError) as e:
            return {"errors": ["validation errors"]}, 400

api.add_resource(Workouts, '/workouts')

class WorkoutByID(Resource):
    def patch(self, id):
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
        
    def delete(self, id):
        workout = Workout.query.filter_by(id=id).first()
        if not workout:
            return {"error": "Workout not found"}, 404
        db.session.delete(workout)
        db.session.commit()
        response = make_response("", 204)
        return response

api.add_resource(WorkoutByID, '/workouts/<int:id>')

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

            if not (1 <= hydration <= 5) or not (1 <= soreness <= 5):
                raise ValueError("Hydration and soreness must be 1-5.")
            if calories_burned < 0:
                raise ValueError("Calories burned must be greater than 0.")

            user = db.session.get(User, user_id)
            workout = db.session.get(Workout, workout_id)
            if not user or not workout:
                return {"error": "User or workout not found"}, 404
            
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

api.add_resource(HealthStats, '/health_stats')

class HealthStatById(Resource):
    def patch(self, id):
        health_stat = HealthStat.query.filter_by(id=id).first()
        if not health_stat:
            return {"error": "HealthStat not found"}, 404

        data = request.get_json()
        try:
            if 'calories_burned' in data:
                health_stat.calories_burned = int(data["calories_burned"])
            if "hydration" in data:
                h = int(data["hydration"])
                if not (1 <= h <= 5): raise ValueError
                health_stat.hydration = h
            if "soreness" in data:
                s = int(data["soreness"])
                if not (1 <= s <= 5): raise ValueError
                health_stat.soreness = s
            db.session.commit()
            health_stat_dict = health_stat.to_dict(['calories_burned', 'hydration', 'soreness'])
            response = make_response(health_stat_dict, 200)
            return response
        except ValueError:
            return {"errors": ["validation errors"]}, 400
        
    def delete(self, id):
        health_stat = HealthStat.query.filter_by(id=id).first()
        if not health_stat:
            return {"error": "HealthStat not found"}, 404
        db.session.delete(health_stat)
        db.session.commit()
        response = make_response("", 204)
        return response

api.add_resource(HealthStatById, '/health_stats/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
