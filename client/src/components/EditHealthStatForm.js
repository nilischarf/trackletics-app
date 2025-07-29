import React, { useState } from "react";
import { Formik } from "formik";

  //  CHANGE FUNCTIONS TO ARROW FUNCTIONS

function EditHealthStatForm({ stat, onUpdateStat }) {
  const [calories, setCalories] = useState(stat.calories_burned);
  const [hydration, setHydration] = useState(stat.hydration);
  const [soreness, setSoreness] = useState(stat.soreness);

  function handleSubmit(e) {
  e.preventDefault();
  fetch(`http://localhost:5555/health_stats/${stat.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      calories_burned: calories,
      hydration,
      soreness,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    })
    .then((updatedStat) => onUpdateStat(updatedStat))
    .catch((error) => alert(error.message));
}

  return (
    <Formik
      initialValues={{
        calories_burned: stat.calories_burned,
        hydration: stat.hydration,
        soreness: stat.soreness,
      }}
      validate={(values) => {
        const errors = {};
        if (!values.calories_burned || isNaN(values.calories_burned)) {
          errors.calories_burned = "Calories must be a number";
        }
        if (values.hydration < 1 || values.hydration > 5) {
          errors.hydration = "Hydration must be between 1 and 5";
        }
        if (values.soreness < 1 || values.soreness > 5) {
          errors.soreness = "Soreness must be between 1 and 5";
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
          value={hydration}
          min="1"
          max="5"
          onChange={(e) => setHydration(parseInt(e.target.value))}
        />
        <input
          placeholder="Soreness (1-5)"
          type="number"
          value={soreness}
          min="1"
          max="5"
          onChange={(e) => setSoreness(parseInt(e.target.value))}
        />
        <button type="submit">Save</button>
      </form>
    </Formik>
  );
}

export default EditHealthStatForm;