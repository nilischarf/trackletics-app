import React from "react";
import WorkoutSelector from "./WorkoutSelector";
import HealthStatForm from "./HealthStatForm";
import HealthStatCard from "./HealthStatCard";
import "../index.css";

function Dashboard({
  user,
  setUser,
  showNewWorkoutForm,
  setShowNewWorkoutForm,
}) {
  const handleAddStat = (newStat) => {
    setUser((prevUser) => {
      const workouts = prevUser.workouts || [];
      const workoutIndex = workouts.findIndex((w) => w.id === newStat.workout_id);

      let updatedWorkouts;
      if (workoutIndex !== -1) {
        updatedWorkouts = workouts.map((w) =>
          w.id === newStat.workout_id
            ? { ...w, health_stats: [...w.health_stats, newStat] }
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
          const updatedWorkouts = prevUser.workouts
            .map((w) =>
              w.id === healthStat.workout_id
                ? {
                    ...w,
                    health_stats: w.health_stats.filter((hs) => hs.id !== healthStat.id),
                  }
                : w
            )
          return { ...prevUser, workouts: updatedWorkouts };
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting stat or associated workout.");
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

  return (
    <div>
      <h2>Hello, {user.username}!</h2>
      <h3>Select a Workout & Add Your Stats</h3>
      <WorkoutSelector
        userId={user.id}
        onAddStat={handleAddStat}
        workouts={user.workouts || []}
        setUser={setUser}
        showNewWorkoutForm={showNewWorkoutForm}
        setShowNewWorkoutForm={setShowNewWorkoutForm}
      />

      <h3>Your Workouts</h3>
      {(user.workouts || []).map((workout) => (
        <div key={workout.id} className="workout-card">
        <h4>
          {workout.name} ({workout.category}) - Difficulty: {workout.difficulty}
        </h4>

        <HealthStatForm
          workoutId={workout.id}
          userId={user.id}
          onAddStat={handleAddStat}
        />

        {(workout.health_stats || [])
          .filter((stat) => stat.user_id === user.id)
          .map((stat) => (
            <HealthStatCard
              key={stat.id}
              stat={stat}
              onUpdateStat={handleUpdateStat}
              onDeleteStat={handleDeleteStat}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;