from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt

class Workout(db.Model, SerializerMixin):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    category = db.Column(db.String)
    difficulty = db.Column(db.Integer)

    health_stats = db.relationship("HealthStat", back_populates="workout", cascade="all, delete")
    users = association_proxy('health_stats', 'user')
    serialize_rules = ('-health_stats',)

    def __repr__(self):
        return f'<Workout {self.id}: {self.name}>'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    health_stats = db.relationship("HealthStat", back_populates="user", cascade="all, delete")
    workouts = association_proxy('health_stats', 'workout')
    serialize_rules = ('-health_stats', '-password_hash')

    @hybrid_property
    def password_hash(self):
        raise Exception("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

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

    def __repr__(self):
        return f'<HealthStat {self.id}>'