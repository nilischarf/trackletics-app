import React, { useState } from "react";
import EditHealthStatForm from "./EditHealthStatForm";

function HealthStatCard({ stat, onUpdateStat, onDeleteStat }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="health-stat-card">
      {isEditing ? (
        <EditHealthStatForm
          stat={stat}
          onUpdateStat={(updatedStat) => {
            onUpdateStat(updatedStat);
            setIsEditing(false);
          }}
        />
      ) : (
        <div>
          <p className="health-stat-details">
            Calories Burned: {stat.calories_burned}
          </p>
          <p className="health-stat-details">Hydration: {stat.hydration}</p>
          <p className="health-stat-details">Soreness: {stat.soreness}</p>
          <button className="button edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="button delete" onClick={() => onDeleteStat(stat)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthStatCard;