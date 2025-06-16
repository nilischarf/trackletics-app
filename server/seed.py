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
    workout_data = [
        ("Morning Run", "Cardio", 3),
        ("Upper Body Strength", "Strength", 4),
        ("Yoga Flow", "Flexibility", 2),
        ("HIIT Blast", "Cardio", 5),
        ("Leg Day", "Strength", 4),
        ("Core Burn", "Strength", 3),
        ("Evening Stretch", "Flexibility", 1),
        ("Cycling Sprint", "Cardio", 4),
        ("Pilates Session", "Flexibility", 2),
        ("Full Body Circuit", "Strength", 5)
    ]
    return [Workout(name=name, category=category, difficulty=difficulty) for name, category, difficulty in workout_data]


def create_users():
    usernames = set()
    while len(usernames) < 5:
        usernames.add(fake.user_name())
    return [User(username=u) for u in usernames]

def create_health_stats(workouts, users):
    health_stats = []

    for _ in range(20):
        workout = rc(workouts)
        user = rc(users)

        calories = randint(200, 800) * (workout.difficulty / 5)  # scale by difficulty
        hydration = randint(2, 5) if workout.category == 'Cardio' else randint(1, 4)
        soreness = randint(2, 5) if workout.difficulty >= 4 else randint(1, 3)

        health_stat = HealthStat(
            calories_burned=int(calories),
            hydration=hydration,
            soreness=soreness,
            user_id=user.id,
            workout_id=workout.id
        )
        health_stats.append(health_stat)

    return health_stats

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
