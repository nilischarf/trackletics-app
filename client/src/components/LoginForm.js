import React, { useState } from "react";
import { Formik } from "formik";
import { Navigate } from "react-router-dom";

//  CHANGE FUNCTIONS TO ARROW FUNCTIONS

function LoginForm({ onLogin, user }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5555/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.ok ? response.json() : Promise.reject("Signup failed"))
      .then((user) => {
        onLogin(user);
      })
      .catch((err) => alert(err));
  }

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.username.trim()) {
          errors.username = "Username is required";
        }
        if (!values.password) {
          errors.password = "Password is required";
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username"
        />
        <input 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          type="password" 
          placeholder="Password" 
        />
        <button type="submit">Log In</button>
      </form>
    </Formik>
  );
}

export default LoginForm;
