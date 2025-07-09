import React, { useState } from "react";

function HealthStatForm({ workoutId, userId, onAddStat }) {
  const [calories, setCalories] = useState("");
  const [hydration, setHydration] = useState(1);
  const [soreness, setSoreness] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5555/health_stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calories_burned: calories,
        hydration,
        soreness,
        workout_id: workoutId,
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then(onAddStat);

    setCalories("");
    setHydration(1);
    setSoreness(1);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Calories Burned"
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <input
        placeholder="Hydration (1-5)"
        type="number"
        min="1"
        max="5"
        value={hydration}
        onChange={(e) => setHydration(parseInt(e.target.value))}
      />
      <input
        placeholder="Soreness (1-5)"
        type="number"
        min="1"
        max="5"
        value={soreness}
        onChange={(e) => setSoreness(parseInt(e.target.value))}
      />
      <button type="submit">Add Stat</button>
    </form>
  );
}

export default HealthStatForm;