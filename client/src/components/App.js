import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./NavBar";
import Login from "./Login";
import Home from "./Home";
import WorkoutsPage from "./WorkoutsPage";
import HealthStatsPage from "./HealthStatsPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <Router>
      <NavBar onLogout={() => setUser(null)} />
      <Switch>
        <Route exact path="/" render={() => <Home user={user} />} />
        <Route path="/workouts" component={WorkoutsPage} />
        <Route path="/health_stats" render={() => <HealthStatsPage user={user} />} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;