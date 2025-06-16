import React from "react";

function WorkoutCard({ workout }) {
  return (
    <div>
      <h3>{workout.name}</h3>
      <p>Category: {workout.category}</p>
      <p>Difficulty: {workout.difficulty}</p>
    </div>
  );
}

export default WorkoutCard;
