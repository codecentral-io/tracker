import React, { Component, Fragment } from "react";

const unitOptions = ["bitcoin", "bits"];

const unitDescriptions = {
  bitcoin: "Bitcoin (BTC)",
  bits: "Bits (1 BTC = 1,000,000 bits)"
};

class DisplaySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: props.units.balance,
      earnings: props.units.earnings
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.updateUnits(this.state);
  };

  render() {
    return (
      <Fragment>
        <div className="h4 text-center my-3">Display Settings</div>
        <form className="bg-white my-3 p-3 border rounded" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Display unit for balance</label>
            <select className="form-control" name="balance" value={this.state.balance} onChange={this.handleChange}>
              {unitOptions.map(option => (
                <option key={option} value={option}>
                  {unitDescriptions[option]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Display unit for earnings</label>
            <select className="form-control" name="earnings" value={this.state.earnings} onChange={this.handleChange}>
              {unitOptions.map(option => (
                <option key={option} value={option}>
                  {unitDescriptions[option]}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Save settings
          </button>
        </form>
      </Fragment>
    );
  }
}

class PoloniexSettings extends Component {
  render() {
    return (
      <Fragment>
        <div className="h4 text-center my-3">Poloniex Settings</div>
        <form className="bg-white my-3 p-3 border rounded">
          <div className="form-group">
            <label>Poloniex API key</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label>Poloniex API secret</label>
            <input type="text" className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary">
            Save settings
          </button>
        </form>
      </Fragment>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <Fragment>
        <DisplaySettings units={this.props.units} updateUnits={this.props.updateUnits} />
        <PoloniexSettings />
      </Fragment>
    );
  }
}

export default Settings;
