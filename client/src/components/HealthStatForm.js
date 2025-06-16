import React, { useState, useEffect } from "react";

function HealthStatForm({ user, onAdd }) {
  const [formData, setFormData] = useState({
    calories_burned: "",
    hydration: "",
    soreness: "",
    workout_id: ""
  });
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetch("/workouts")
      .then((r) => r.json())
      .then(setWorkouts);
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      user_id: user.id,
      calories_burned: parseInt(formData.calories_burned),
      hydration: parseInt(formData.hydration),
      soreness: parseInt(formData.soreness)
    };
    fetch("/health_stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend)
    })
      .then((r) => r.json())
      .then(onAdd);
    setFormData({
      calories_burned: "",
      hydration: "",
      soreness: "",
      workout_id: ""
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="calories_burned" value={formData.calories_burned} onChange={handleChange} placeholder="Calories Burned" />
      <input name="hydration" value={formData.hydration} onChange={handleChange} placeholder="Hydration (1-5)" />
      <input name="soreness" value={formData.soreness} onChange={handleChange} placeholder="Soreness (1-5)" />
      <select name="workout_id" value={formData.workout_id} onChange={handleChange}>
        <option value="">Select Workout</option>
        {workouts.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
      <button type="submit">Add Health Stat</button>
    </form>
  );
}

export default HealthStatForm;