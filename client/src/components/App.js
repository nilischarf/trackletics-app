import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Home from "./Home";
import Dashboard from "./Dashboard";
import NavBar from "./NavBar";

function App() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5555/check_session", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Not logged in");
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5555/workouts")
      .then((response) => response.json())
      .then(setWorkouts);
  }, []);

  function handleLogout() {
    fetch("http://localhost:5555/logout", {
      method: "DELETE",
      credentials: "include",
    }).then(() => setUser(null));
  }

  return (
    <Router>
      <NavBar user={user} onLogout={handleLogout} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          path="/login"
          render={() =>
            user ? (
              <Redirect to="/dashboard" />
            ) : (
              <LoginForm onLogin={setUser} setWorkouts={setWorkouts} />
            )
          }
        />        
        <Route
          path="/signup"
          render={() =>
            user ? (
              <Redirect to="/dashboard" />
            ) : (
              <SignupForm onSignup={setUser} setWorkouts={setWorkouts} />
            )
          }
        />
        <Route
          path="/dashboard"
          render={() =>
            user ? (
              <Dashboard
                user={user}
                setUser={setUser}
                workouts={workouts}
                setWorkouts={setWorkouts}
                showNewWorkoutForm={showNewWorkoutForm}
                setShowNewWorkoutForm={setShowNewWorkoutForm}
              />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route render={() => <h2>404: Page not found</h2>} />
      </Switch>
    </Router>
  );
}

export default App;