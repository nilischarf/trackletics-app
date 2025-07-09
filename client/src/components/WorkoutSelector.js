import React, { useState } from "react";

function WorkoutSelector({
  userId,
  onAddStat,
  workouts,
  setWorkouts,
  showNewWorkoutForm,
  setShowNewWorkoutForm,
}) {
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    category: "",
    difficulty: "",
  });

  const [statData, setStatData] = useState({
    workout_id: "",
    calories_burned: "",
    hydration: 1,
    soreness: 1,
  });

  const handleNewWorkoutChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setStatData({
      ...statData,
      [name]: name === "hydration" || name === "soreness" ? parseInt(value) : value,
    });
  };

  const handleNewWorkoutSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5555/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWorkout),
    });
    const createdWorkout = await res.json();

    setWorkouts((prev) => [...prev, createdWorkout]);
    setShowNewWorkoutForm(false);
    setNewWorkout({ name: "", category: "", difficulty: "" });
    setStatData((prev) => ({ ...prev, workout_id: createdWorkout.id }));
  };

  const handleStatSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5555/health_stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...statData,
        workout_id: parseInt(statData.workout_id),
        user_id: userId,
      }),
    });
    const newStat = await res.json();
    onAddStat(newStat);

    setStatData({
      workout_id: "",
      calories_burned: "",
      hydration: 1,
      soreness: 1,
    });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showNewWorkoutForm}
          onChange={() => setShowNewWorkoutForm((prev) => !prev)}
        />
        Add New Workout
      </label>

      {showNewWorkoutForm ? (
        <form onSubmit={handleNewWorkoutSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Workout Name"
            value={newWorkout.name}
            onChange={handleNewWorkoutChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newWorkout.category}
            onChange={handleNewWorkoutChange}
            required
          />
          <input
            type="text"
            name="difficulty"
            placeholder="Difficulty"
            value={newWorkout.difficulty}
            onChange={handleNewWorkoutChange}
            required
          />
          <button type="submit">Save Workout</button>
        </form>
      ) : (
        <form onSubmit={handleStatSubmit}>
          <select
            name="workout_id"
            value={statData.workout_id}
            onChange={handleStatChange}
            required
          >
            <option value="">-- Select a Workout --</option>
            {workouts.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.category})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="calories_burned"
            placeholder="Calories Burned"
            value={statData.calories_burned}
            onChange={handleStatChange}
            required
          />
          <input
            type="number"
            name="hydration"
            placeholder="Hydration (1-5)"
            min="1"
            max="5"
            value={statData.hydration}
            onChange={handleStatChange}
            required
          />
          <input
            type="number"
            name="soreness"
            placeholder="Soreness (1-5)"
            min="1"
            max="5"
            value={statData.soreness}
            onChange={handleStatChange}
            required
          />
          <button type="submit">Add to My Workouts</button>
        </form>
      )}
    </div>
  );
}

export default WorkoutSelector;