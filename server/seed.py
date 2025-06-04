#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Workout, User, HealthStat

fake = Faker()

def create_workouts():
    workouts = []
    for _ in range(10):
        w = Workout(
            name=fake.sentence(),
            difficulty=randint(1, 5)
        )
        workouts.append(w)

    return workouts

def create_users():
    users = []
    for _ in range(5):
        u = User(
            username=fake.name(),
        )
        users.append(u)

    return users

def create_health_stats(workouts, users):
    health_stats = []
    for _ in range(20):
        h = HealthStat(
            calories_burned=rc(range(500)),
            hydration=randint(1, 5),
            soreness=randint(1, 5),
            user_id=rc([user.id for user in users]),
            workout_id=rc([workout.id for workout in workouts])
        )
        health_stats.append(h)

    return health_stats


if __name__ == '__main__':
    with app.app_context():
        print("Clearing db...")
        Workout.query.delete()
        HealthStat.query.delete()
        User.query.delete()

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
