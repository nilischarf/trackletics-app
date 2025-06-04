#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from config import create_app, db
from models import Workout, User, HealthStat

app=create_app()
fake = Faker()

def create_workouts():
    return [Workout(name=fake.sentence(), category=fake.sentence(), difficulty=randint(1, 5)) for _ in range(10)]

def create_users():
    return [User(username=fake.name()) for _ in range(5)]

def create_health_stats(workouts, users):
    return [
        HealthStat(
            calories_burned=rc(range(500)),
            hydration=randint(1, 5),
            soreness=randint(1, 5),
            user_id=rc([user.id for user in users]),
            workout_id=rc([workout.id for workout in workouts])
        ) for _ in range(20)
    ]


if __name__ == '__main__':
    with app.app_context():
        print("Clearing db...")
        db.session.query(HealthStat).delete()
        db.session.query(Workout).delete()
        db.session.query(User).delete()

        print("Seeding workouts...")
        workouts = create_workouts()
        db.session.add_all(workouts)
        db.session.commit()

        print("Seeding users...")
        users = create_users()
        db.session.add_all(users)
        db.session.commit()

        print("Seeding health stats...")
        health_stats = create_health_stats(workouts, users)
        db.session.add_all(health_stats)
        db.session.commit()


        print("Done seeding!")
