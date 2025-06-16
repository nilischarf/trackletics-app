import React, { useEffect, useState } from "react";
import HealthStatCard from "./HealthStatCard";
import HealthStatForm from "./HealthStatForm";

function HealthStatsPage({ user }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch("/health_stats")
      .then((r) => r.json())
      .then((data) => setStats(data.filter(s => s.user_id === user.id)));
  }, [user.id]);

  function handleAdd(newStat) {
    setStats((stats) => [...stats, newStat]);
  }

  function handleUpdate(updatedStat) {
    setStats((stats) =>
      stats.map((s) => (s.id === updatedStat.id ? updatedStat : s))
    );
  }

  function handleDelete(id) {
    setStats((stats) => stats.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h2>Your Health Stats</h2>
      <HealthStatForm user={user} onAdd={handleAdd} />
      {stats.map((stat) => (
        <HealthStatCard
          key={stat.id}
          stat={stat}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default HealthStatsPage;
