import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Home from "./Home";
import Dashboard from "./Dashboard";
import NavBar from "./NavBar";

// need to make sure when i reload dashboard it goes back to login
// change all functions to arrow functions in all components 

function App() {
  const [user, setUser] = useState(null);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);

  useEffect(() => {
    fetch("/check_session", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.username) {
          setUser(user)
        } 
      })
        
    fetch("/workouts", {
      method: "GET",
      credentials: "include",
    })  
      .then((response) => response.json())
      .then(setAllWorkouts)
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm user={user} onLogin={setUser} />} />  
        <Route path="/signup" element={<SignupForm user={user} onSignup={setUser} setAllWorkouts={setAllWorkouts} />} />      
        <Route
          path="/dashboard"
          element={
            <Dashboard
              user={user}
              setUser={setUser}
              allWorkouts={allWorkouts}
              setAllWorkouts={setAllWorkouts}
              showNewWorkoutForm={showNewWorkoutForm}
              setShowNewWorkoutForm={setShowNewWorkoutForm}
            />
          }
        />
        <Route path="*" element={<h2>404: Page not found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;