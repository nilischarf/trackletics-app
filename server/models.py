from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from config import app, db

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

# Models go here!
class Workout(db.Model, SerializerMixin):
    __tablename__ = 'workouts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    difficulty = db.Column(db.Integer)

    health_stats = db.relationship("HealthStat", back_populates="workout", cascade="all, delete")
    users = association_proxy('health_stats', 'user')
    
    serialize_rules = ('-health_stats',)

    # add validations if need 
    
    def __repr__(self):
        return f'<Workout {self.id}: {self.name}>'


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)

    health_stats = db.relationship("HealthStat", back_populates="user", cascade="all, delete")
    workouts = association_proxy('health_stats', 'workout')

    serialize_rules = ('-health_stats',)

    # add validations if need 

    def __repr__(self):
        return f'User {self.id}: {self.username}'

class HealthStat(db.Model, SerializerMixin):
    __tablename__ = 'health_stats'

    id = db.Column(db.Integer, primary_key=True)
    calories_burned = db.Column(db.Integer)
    hydration = db.Column(db.Integer)
    soreness = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'))

    user = db.relationship("User", back_populates="health_stats")
    workout = db.relationship("Workout", back_populates="health_stats")
    
    serialize_rules = ('-user.health_stats', '-workout.health_stats')
    
    # Add validations if need 
    
    def __repr__(self):
        return f'<HealthStat {self.id}>'