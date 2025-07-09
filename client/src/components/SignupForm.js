import React, { useState } from "react";

function SignupForm({ onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5555/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.ok ? response.json() : Promise.reject("Signup failed"))
      .then((user) => {
        onSignup(user);
      })
      .catch((err) => alert(err));
  }

  return (
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
  );
}

export default SignupForm;