import React, { useState } from "react";
import { Formik } from "formik";
import { Navigate } from "react-router-dom";

function SignupForm({ onSignup, user }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5555/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return response.json().then((err) => {
            return Promise.reject(err.error || "Signup failed")
          })
        }
      })
      .then((user) => {
        onSignup(user);
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
        } else if (values.password.length < 6) {
          errors.password = "Password must be at least 6 characters";
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>
      </form>
    </Formik>
  );
}

export default SignupForm;