import React from "react";
import { Link } from "react-router-dom";

function NavBar({ user, onLogout }) {
  return (
    <nav>
      <Link to="/"> Home </Link>
      {user ? (
        <>
          <Link to="/dashboard"> Dashboard </Link>
          <button onClick={onLogout}> Logout </button>
        </>
      ) : (
        <>
          <Link to="/login" > Login </Link>
          <Link to="/signup"> Sign Up </Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;