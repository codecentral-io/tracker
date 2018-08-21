import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";

const NotFound = ({ location }) => (
  <div className="h3 text-center my-3">
    Error: No page found for <code>{location.pathname}</code>.
  </div>
);

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: {
        balance: "bitcoin",
        earnings: "bits"
      }
    };
  }

  updateUnits = units => {
    this.setState({ units: units });
  };

  render() {
    return (
      <main className="container">
        <Switch>
          <Route exact path="/" render={props => <Home {...props} units={this.state.units} />} />
          <Route
            exact
            path="/settings"
            render={props => <Settings {...props} units={this.state.units} updateUnits={this.updateUnits} />}
          />
          <Route component={NotFound} />
        </Switch>
      </main>
    );
  }
}

export default Main;
