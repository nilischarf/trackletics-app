import React, { useState } from "react";

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
  );
}

export default EditHealthStatForm;