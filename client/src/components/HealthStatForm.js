import React, { useState } from "react";
import { Formik } from "formik";

function HealthStatForm({ workoutId, userId, onAddStat }) {
  const [calories, setCalories] = useState("");
  const [hydration, setHydration] = useState(1);
  const [soreness, setSoreness] = useState(1);

  const handleSubmit = (e) => {
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
    <Formik
      initialValues={{
        calories_burned: "",
        hydration: 1,
        soreness: 1,
      }}
      validate={(values) => {
        const errors = {};
        if (!values.calories_burned) {
          errors.calories_burned = "Calories burned is required";
        } else if (isNaN(values.calories_burned)) {
          errors.calories_burned = "Must be a number";
        }

        if (values.hydration < 1 || values.hydration > 5) {
          errors.hydration = "Hydration must be between 1–5";
        }

        if (values.soreness < 1 || values.soreness > 5) {
          errors.soreness = "Soreness must be between 1–5";
        }

        return errors;
      }}
      onSubmit={handleSubmit}
    >
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
    </Formik>
  );
}

export default HealthStatForm;