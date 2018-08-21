import React, { Component, Fragment } from "react";
import Main from "./Main";
import Navbar from "./Navbar";

class App extends Component {
  componentDidMount() {
    document.body.className = "bg-light";
    document.body.style.fontFamily = "'Lato', sans-serif";
  }

  render() {
    return (
      <Fragment>
        <Navbar />
        <Main />
      </Fragment>
    );
  }
}

export default App;
