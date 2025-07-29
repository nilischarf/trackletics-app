import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutSelector from "./WorkoutSelector";
import HealthStatForm from "./HealthStatForm";
import HealthStatCard from "./HealthStatCard";
import "../index.css";

function Dashboard({
    user,
    setUser,
    allWorkouts,
    setAllWorkouts,
    showNewWorkoutForm,
    setShowNewWorkoutForm,
  }) 

{

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [])
  
  const handleAddStat = (newStat) => {
    setUser((prevUser) => {
      const workouts = prevUser.workouts || [];
      const workoutIndex = workouts.findIndex((w) => w.id === newStat.workout_id);

      let updatedWorkouts;
      if (workoutIndex !== -1) {
        updatedWorkouts = workouts.map((w) =>
          w.id === newStat.workout_id
            ? { ...w, health_stats: [...(w.health_stats || []), newStat] }
            : w
        );
      } else {
        const newWorkout = {
          id: newStat.workout_id,
          name: newStat.workout?.name || "New Workout",
          category: newStat.workout?.category || "",
          difficulty: newStat.workout?.difficulty || "",
          health_stats: [newStat],
        };
        updatedWorkouts = [...workouts, newWorkout];
      }

      return { ...prevUser, workouts: updatedWorkouts };
    });
  };

  const handleDeleteStat = (healthStat) => {
    fetch(`http://localhost:5555/health_stats/${healthStat.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete health stat");
        return response;
      })
      .then(() => {
        setUser((prevUser) => {
          let updatedWorkouts = prevUser.workouts.map((w) => {
            if (w.id === healthStat.workout_id) {
              return {
                ...w,
                health_stats: w.health_stats.filter((hs) => hs.id !== healthStat.id),
              };
            }
            return w;
          });
  
          updatedWorkouts = updatedWorkouts.filter((w) => w.health_stats.length > 0);
  
          return { ...prevUser, workouts: updatedWorkouts };
        });
      })
      .catch((error) => {
        alert(`Error deleting stat or associated workout: ${error}.`);
      });
  };

  const handleUpdateStat = (updatedStat) => {
    setUser((prevUser) => {
      const updatedWorkouts = prevUser.workouts.map((w) =>
        w.id === updatedStat.workout_id
          ? {
              ...w,
              health_stats: w.health_stats.map((hs) =>
                hs.id === updatedStat.id ? updatedStat : hs
              ),
            }
          : w
      );
      return { ...prevUser, workouts: updatedWorkouts };
    });
  };

  if (user) {

  
  return (
    <div>
      <h2>Hello, {user.username}!</h2>
      <h3>Select a Workout & Add Your Stats</h3>
      <WorkoutSelector
        userId={user.id}
        onAddStat={handleAddStat}
        setUser={setUser}
        allWorkouts={allWorkouts || []}
        setAllWorkouts={setAllWorkouts}
        showNewWorkoutForm={showNewWorkoutForm}
        setShowNewWorkoutForm={setShowNewWorkoutForm}
      />

      <h3>Your Workouts</h3>
      {(user.workouts || []).length === 0 ? (
        <p>You haven't added any health stats yet.</p>
      ) : (
        user.workouts.map((workout) => (
          <div key={workout.id} className="workout-card">
            <h4>
              {workout.name} ({workout.category}) - Difficulty: {workout.difficulty}
            </h4>

            <HealthStatForm
              workoutId={workout.id}
              userId={user.id}
              onAddStat={handleAddStat}
            />

            {workout.health_stats
              .map((stat) => (
                <HealthStatCard
                  key={stat.id}
                  stat={stat}
                  onUpdateStat={handleUpdateStat}
                  onDeleteStat={handleDeleteStat}
                />
              ))}
          </div>
        ))
      )}
    </div>
  );
  }
}

export default Dashboard;