import { faCog, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";

const Brand = () => <div className="navbar-brand">Tracker</div>;

const HomeLink = () => (
  <NavLink className="nav-item nav-link" exact to="/">
    <FontAwesomeIcon icon={faHome} className="mr-2" />
    Home
  </NavLink>
);

const SettingsLink = () => (
  <NavLink className="nav-item nav-link" exact to="/settings">
    <FontAwesomeIcon icon={faCog} className="mr-2" />
    Settings
  </NavLink>
);

const UserDropdown = () => (
  <div className="nav-item dropdown">
    <button className="btn btn-link nav-link active dropdown-toggle" type="button" data-toggle="dropdown">
      <FontAwesomeIcon icon={faUser} className="mr-2" />
      User
    </button>
    <div className="dropdown-menu">
      <button className="btn btn-link dropdown-item" type="button">
        Log Out
      </button>
    </div>
  </div>
);

const Navbar = () => (
  <nav className="navbar navbar-expand-sm navbar-dark" style={{ backgroundColor: "royalblue" }}>
    <div className="container">
      <Brand />
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarContent">
        <div className="navbar-nav mr-auto">
          <HomeLink />
          <SettingsLink />
        </div>
        <div className="navbar-nav">
          <UserDropdown />
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
