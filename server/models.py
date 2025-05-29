from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

# Models go here!
class Workout(db.Model, SerializerMixin):
    __tablename__ = 'workouts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    # can add more attributes - difficulty = db.Column(db.Integer)

    calories = db.relationship("Calorie", back_populates="workout", cascade="all, delete")
    users = association_proxy('calories', 'user')
    
    serialize_rules = ('-calories',)

    # add validations if need 
    
    def __repr__(self):
        return f'<Workout {self.id}: {self.name}>'


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)

    calories = db.relationship("Calorie", back_populates="user", cascade="all, delete")
    workouts = association_proxy('calories', 'workout')

    serialize_rules = ('-calories',)

    # add validations if need 

    def __repr__(self):
        return f'User {self.id}: {self.username}'

class Calorie(db.Model, SerializerMixin):
    __tablename__ = 'calories'

    id = db.Column(db.Integer, primary_key=True)
    calories_burned = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'))

    user = db.relationship("User", back_populates="calories")
    workout = db.relationship("Workout", back_populates="calories")
    
    serialize_rules = ('-user.calories', '-workout.calories')
    
    # Add validations if need 
    
    def __repr__(self):
        return f'<Calorie {self.id}>'