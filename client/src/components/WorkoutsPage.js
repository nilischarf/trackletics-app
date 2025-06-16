import React, { useState, useEffect } from "react";
import WorkoutCard from "./WorkoutCard";

function WorkoutsPage() {
    const [workouts, setWorkouts] = useState([]);
  
    useEffect(() => {
      fetch("/workouts")
        .then((r) => r.json())
        .then(setWorkouts);
    }, []);
  
    return (
      <div>
        <h2>Workouts</h2>
        {workouts.map((w) => (
          <WorkoutCard key={w.id} workout={w} />
        ))}
      </div>
    );
  }
  
  export default WorkoutsPage;