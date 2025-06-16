import React, { useState } from "react";

function HealthStatCard({ stat, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    calories_burned: stat.calories_burned,
    hydration: stat.hydration,
    soreness: stat.soreness
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`/health_stats/${stat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((r) => r.json())
      .then(onUpdate);
    setEditing(false);
  }

  function handleDelete() {
    fetch(`/health_stats/${stat.id}`, {
      method: "DELETE"
    }).then(() => onDelete(stat.id));
  }

  return (
    <div>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input name="calories_burned" value={formData.calories_burned} onChange={handleChange} />
          <input name="hydration" value={formData.hydration} onChange={handleChange} />
          <input name="soreness" value={formData.soreness} onChange={handleChange} />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <p>Calories Burned: {stat.calories_burned}</p>
          <p>Hydration: {stat.hydration}</p>
          <p>Soreness: {stat.soreness}</p>
        </>
      )}
      <button onClick={() => setEditing((e) => !e)}>{editing ? "Cancel" : "Edit"}</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default HealthStatCard;
