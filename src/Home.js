import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React, { Component, Fragment } from "react";

const formatAmount = (amount, unit) =>
  unit === "bitcoin"
    ? amount.toLocaleString("en-US", { maximumFractionDigits: 4 }) + " BTC"
    : (1e6 * amount).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " bits";

const getChartOptions = (name, data, unit) => {
  const decimals = { bitcoin: 8, bits: 2 }[unit];
  const symbol = { bitcoin: "BTC", bits: "bits" }[unit];
  return {
    series: [
      {
        name: name,
        data: unit === "bitcoin" ? data : data.map(row => [row[0], 1e6 * row[1]]),
        step: true,
        tooltip: {
          valueDecimals: decimals,
          valueSuffix: ` ${symbol}`
        }
      }
    ],
    xAxis: {
      ordinal: false,
      type: "datetime"
    },
    yAxis: {
      title: {
        text: `${name} (${symbol})`
      }
    },
    rangeSelector: {
      buttons: [
        { type: "day", count: 1, text: "1d" },
        { type: "week", count: 1, text: "1w" },
        { type: "month", count: 1, text: "1m" },
        { type: "year", count: 1, text: "1y" },
        { type: "all", text: "All" }
      ],
      selected: 4
    }
  };
};

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    setTimeout(
      () =>
        fetch("balance.json")
          .then(response => response.json())
          .then(json => this.setState({ data: json })),
      1000
    );
  }

  render() {
    const wrap = interior => (
      <Fragment>
        <div className="h4 my-3 text-center">Account Balance</div>
        <div className="bg-white border rounded my-3 p-3">{interior}</div>
      </Fragment>
    );

    if (!this.state.data.length) {
      return wrap(
        <div className="text-center" style={{ fontSize: "1.25em" }}>
          Loading...
        </div>
      );
    } else {
      const lastRow = this.state.data[this.state.data.length - 1];
      const unused = parseFloat(lastRow[1]);
      const open = parseFloat(lastRow[2]);
      const active = parseFloat(lastRow[3]);
      const total = unused + open + active;
      const chartData = this.state.data.map(row => [
        Date.parse(row[0] + "Z"),
        parseFloat(row[1]) + parseFloat(row[2]) + parseFloat(row[3])
      ]);
      const chartOptions = getChartOptions("Total", chartData, this.props.unit);
      return wrap(
        <Fragment>
          <div className="row text-center">
            <div className="col-6 col-sm-3 mb-3">
              <div className="text-muted">Unused</div>
              <div style={{ fontSize: "1.25em" }}>{formatAmount(unused, this.props.unit)}</div>
            </div>
            <div className="col-6 col-sm-3 mb-3">
              <div className="text-muted">Open</div>
              <div style={{ fontSize: "1.25em" }}>{formatAmount(open, this.props.unit)}</div>
            </div>
            <div className="col-6 col-sm-3 mb-3">
              <div className="text-muted">Active</div>
              <div style={{ fontSize: "1.25em" }}>{formatAmount(active, this.props.unit)}</div>
            </div>
            <div className="col-6 col-sm-3 mb-3">
              <div className="text-muted">Total</div>
              <div style={{ fontSize: "1.25em" }}>{formatAmount(total, this.props.unit)}</div>
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} />
        </Fragment>
      );
    }
  }
}

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Balance unit={this.props.units.balance} />
      </Fragment>
    );
  }
}

export default Home;
