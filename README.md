Introduction 

Trackletics is a full-stack workout tracking application that allows users to track their physical activity and wellness. It is built whith a Flask backend and React frontend. It allows users to log in securely with session-based authentication, choose from a list of workouts or add their own, add health stats like calories burned, hydration, and soreness for specific workouts. The user can also view, edit, and delete only their own workouts and health stats.

Routes

Trackletics includes session-based auth routes and full CRUD routes for users, workouts, and health stats.

Authentication Routes
POST	/signup	- Register a new user
POST	/login	- Log in an existing user
GET	/check_session	- Get current logged-in user
DELETE	/logout	- Log out the current session

Workout & Stat Routes=
GET	/workouts	- Get all available workout types 
POST	/user_workouts	- Add a new workout instance for the logged-in user
GET	/user_workouts	- Get current user's workouts
POST	/health_stats	- Add a new health stat to a workout
PATCH	/health_stats/<id>	- Edit a specific health stat
DELETE	/health_stats/<id>	- Delete a specific health stat

Models
Trackletics uses SQLAlchemy for ORM and includes four main models:
User - Has secure password storage via password hashing. 
Workout - Represents a global list of workout types. 
HealthStat - Contains fields such as calories_burned, hydration, and soreness.
All models are serialized with sqlalchemy-serializer.

Important Files (Backend)
app.py - Registers resources, initializes the session, and handles route error handling.
config.py 0 Centralizes app setup including: app instantiation, SQLAlchemy db, Flask-Migrate migrate, Flask-RESTful api, Flask-CORS setup, prevents circular imports and keeps configuration DRY and modular.
models.py - Defines SQLAlchemy models (User, Workout, UserWorkout, HealthStat), Includes relationships, validations, and serialization rules.
seed.py - Generates initial data for workouts and users using standard Python logic. 

Important Files (Frontend)
App.js - Main app wrapper that: Holds global state for user, workouts, and form visibility, Handles session check on load, Contains client-side routing using react-router-dom
Dashboard.js - Displays a user’s selected workouts and the nested health stats for each workout, Renders components like WorkoutSelector and HealthStatCard.
WorkoutSelector.js - Allows users to select from global workout options or add a new workout, Uses dropdown UI with conditionally rendered input fields.
HealthStatCard.js - Displays a single health stat with calories and hydration, Includes buttons to edit or delete the stat, Conditionally renders an EditHealthStatForm.
HealthStatForm.js - Controlled form (using Formik) to add a new health stat, Fields include calories burned, hydration, and notes, Sends a POST request to the backend.
EditHealthStatForm.js - Similar to HealthStatForm, but allows updating an existing health stat, Prefilled values are tied to the selected stat and passed in via props.

How to Run the App
Backend:
cd server
pipenv install
pipenv shell
flask db init
flask db revision -m "Initial"
flask db upgrade head
python seed.py
python app.py

Frontend:
npm install --prefix client
npm start --prefix client

Resources Used
Flask-CORS Documentation
SQLAlchemy Documentation
Formik
React Router
Flask-Migrate

License
License: MIT License

Copyright (c) [2025] [Nili Scharf]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.