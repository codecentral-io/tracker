import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => <div>Home</div>;

const Settings = () => <div>Settings</div>;

const NotFound = ({ location }) => (
  <div>
    No page found for <code>{location.pathname}</code>.
  </div>
);

class App extends Component {
  componentDidMount() {
    document.body.className = "bg-light";
  }

  render() {
    return (
      <Fragment>
        <Navbar />
        <main className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}

export default App;
