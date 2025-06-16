import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({ onLogout }) {
  function handleLogout() {
    fetch("/logout", { method: "DELETE" }).then(() => onLogout());
  }

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/workouts">Workouts</NavLink>
      <NavLink to="/health_stats">Health Stats</NavLink>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default NavBar;