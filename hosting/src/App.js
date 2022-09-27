import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginRedirect from "./pages/LoginRedirect";

const App = () => {
  return (
    <Router>
      <Route exact path="/auth/:providerName/callback" component={LoginRedirect} />
      <Route exact path="/" component={Home} />
    </Router>
  );
};

export default App;
