import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

const Home = () => <div>Home</div>;

const Settings = () => <div>Settings</div>;

const NotFound = ({ location }) => (
  <div>
    No page found for <code>{location.pathname}</code>.
  </div>
);

class Main extends Component {
  render() {
    return (
      <main className="container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    );
  }
}

export default Main;
