import React, { useState } from "react";
import { Formik } from "formik";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5555/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",  
      body: JSON.stringify({ username, password })
    })
      .then((response) => response.ok ? response.json() : Promise.reject("Login failed"))
      .then((user) => {
        onLogin(user);
      })
      .catch((error) => alert(error));
  }

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.username) {
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
