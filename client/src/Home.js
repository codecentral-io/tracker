import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React, { Component, Fragment } from "react";

const formatAmount = (amount, unit, decimals) =>
  unit === "bitcoin"
    ? amount.toLocaleString("en-US", {
        minimumFractionDigits: decimals || 0,
        maximumFractionDigits: decimals || 4
      }) + " BTC"
    : (1e6 * amount).toLocaleString("en-US", {
        minimumFractionDigits: decimals || 0,
        maximumFractionDigits: decimals || 2
      }) + " bits";

const formatDuration = days => {
  let seconds = days * 24 * 60 * 60;
  days = Math.floor(seconds / (24 * 60 * 60));
  let hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  let minutes = Math.floor((seconds % (60 * 60)) / 60);
  seconds = Math.floor(seconds % 60);
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

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
        text: `${name} (${symbol[0].toUpperCase() + symbol.slice(1)})`
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
    const wrap = balance => (
      <Fragment>
        <div className="h4 my-3 text-center">Account Balance</div>
        <div className="bg-white border rounded my-3 p-3">{balance}</div>
      </Fragment>
    );

    if (!this.state.data.length) {
      return wrap(
        <div className="text-center" style={{ fontSize: "1.25em" }}>
          Loading...
        </div>
      );
    }

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

const PerPeriodEarnings = ({ data, unit }) => {
  if (!data.length) {
    return (
      <div className="text-center" style={{ fontSize: "1.25em" }}>
        Loading...
      </div>
    );
  }

  let hourly = [];
  let daily = [];
  data
    .filter(row => row.currency === "BTC")
    .reverse()
    .forEach(row => {
      const millisPerHour = 60 * 60 * 1000;
      const hourIndex = Math.floor((Date.now() - Date.parse(row.close + "Z")) / millisPerHour);
      while (hourly.length <= hourIndex) hourly.push(0);
      hourly[hourIndex] += parseFloat(row.earned);

      const millisPerDay = 24 * 60 * 60 * 1000;
      const dayIndex = Math.floor((Date.now() - Date.parse(row.close + "Z")) / millisPerDay);
      while (daily.length <= dayIndex) daily.push(0);
      daily[dayIndex] += parseFloat(row.earned);
    });
  hourly.reverse();
  daily.reverse();

  const hourlyMean = hourly.reduce((a, b) => a + b, 0) / hourly.length;
  const dailyMean = daily.reduce((a, b) => a + b, 0) / daily.length;

  const hourlyMedian = hourly.sort((a, b) => a - b)[Math.floor(hourly.length / 2)];
  const dailyMedian = daily.sort((a, b) => a - b)[Math.floor(daily.length / 2)];

  const chartData = data
    .filter(row => row.currency === "BTC")
    .map(row => [Date.parse(row.close + "Z"), parseFloat(row.earned)]);

  let chartOptions = getChartOptions("Earnings", chartData, unit);
  chartOptions.navigator = { series: { type: "column" } };
  chartOptions.series[0].type = "column";

  return (
    <Fragment>
      <div className="row text-center">
        <div className="col-6 mb-3">
          <div className="text-muted">Average hourly</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(hourlyMean, unit)}</div>
        </div>
        <div className="col-6 mb-3">
          <div className="text-muted">Average daily</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(dailyMean, unit)}</div>
        </div>
        <div className="col-6 mb-3">
          <div className="text-muted">Median hourly</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(hourlyMedian, unit)}</div>
        </div>
        <div className="col-6 mb-3">
          <div className="text-muted">Median daily</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(dailyMedian, unit)}</div>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} />
    </Fragment>
  );
};

const CumulativeEarnings = ({ data, unit }) => {
  if (!data.length) {
    return (
      <div className="text-center" style={{ fontSize: "1.25em" }}>
        Loading...
      </div>
    );
  }

  let earningsDay = 0;
  let earningsWeek = 0;
  let earningsMonth = 0;
  let earningsAll = 0;
  data.filter(row => row.currency === "BTC").forEach(row => {
    const close = Date.parse(row.close + "Z");
    const earned = parseFloat(row.earned);
    if (Date.now() < close + 24 * 60 * 60 * 1000) earningsDay += earned;
    if (Date.now() < close + 7 * 24 * 60 * 60 * 1000) earningsWeek += earned;
    if (Date.now() < close + 30 * 24 * 60 * 60 * 1000) earningsMonth += earned;
    earningsAll += earned;
  });

  let earned = 0;
  const chartData = data.filter(row => row.currency === "BTC").map(row => {
    earned += parseFloat(row.earned);
    return [Date.parse(row.close), earned];
  });

  const chartOptions = getChartOptions("Earnings", chartData, unit);

  return (
    <Fragment>
      <div className="row text-center">
        <div className="col-6 mb-3">
          <div className="text-muted">Past day</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(earningsDay, unit)}</div>
        </div>
        <div className="col-6 mb-3">
          <div className="text-muted">Past week</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(earningsWeek, unit)}</div>
        </div>
        <div className="col-6 mb-3">
          <div className="text-muted">Past month</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(earningsMonth, unit)}</div>
        </div>
        <div className="col-6 mb-3">
          <div className="text-muted">Total</div>
          <div style={{ fontSize: "1.25em" }}>{formatAmount(earningsAll, unit)}</div>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} />
    </Fragment>
  );
};

class Earnings extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    setTimeout(
      () =>
        fetch("loans.json")
          .then(response => response.json())
          .then(json => {
            json.sort((a, b) => Date.parse(a.close) - Date.parse(b.close));
            this.setState({ data: json });
          }),
      1000
    );
  }

  render() {
    return (
      <div className="row my-3">
        <div className="col-md-6 pr-md-2 mb-3 mb-md-0">
          <div className="h4 mb-3 text-center">Per-Period Earnings</div>
          <div className="bg-white border rounded p-3">
            <PerPeriodEarnings data={this.state.data} unit={this.props.unit} />
          </div>
        </div>
        <div className="col-md-6 pl-md-2">
          <div className="h4 mb-3 text-center">Cumulative Earnings</div>
          <div className="bg-white border rounded p-3">
            <CumulativeEarnings data={this.state.data} unit={this.props.unit} />
          </div>
        </div>
      </div>
    );
  }
}

class Loans extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    setTimeout(
      () =>
        fetch("loans.json")
          .then(response => response.json())
          .then(json => {
            this.setState({ data: json });
          }),
      1000
    );
  }

  render() {
    const wrap = loans => (
      <Fragment>
        <div className="h4 text-center my-3">Recent Loans</div>
        {loans}
      </Fragment>
    );

    if (!this.state.data.length) {
      return wrap(
        <div className="bg-white border rounded my-3 p-3">
          <div className="text-center" style={{ fontSize: "1.25em" }}>
            Loading...
          </div>
        </div>
      );
    }

    return wrap(
      <table className="table table-hover text-center bg-white border my-3">
        <thead>
          <tr>
            <th scope="col">Close</th>
            <th scope="col" className="d-none d-sm-table-cell">
              Amount
            </th>
            <th scope="col" className="d-none d-sm-table-cell">
              Rate
            </th>
            <th scope="col">Earned</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data
            .filter(row => row.currency === "BTC")
            .slice(0, 20)
            .map((row, i) => (
              <Fragment key={i}>
                <tr data-toggle="collapse" data-target={`#collapse-${i}`} style={{ cursor: "pointer" }}>
                  <td>
                    {row.close.split(" ")[0]} <span className="d-none d-md-inline">{row.close.split(" ")[1]}</span>
                  </td>
                  <td className="d-none d-sm-table-cell">{formatAmount(parseFloat(row.amount), "bitcoin", 8)}</td>
                  <td className="d-none d-sm-table-cell">{(100 * parseFloat(row.rate)).toFixed(4)}%</td>
                  <td>{formatAmount(parseFloat(row.earned), this.props.unit)}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-top-0 py-0">
                    <div id={`collapse-${i}`} className="collapse">
                      <div style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
                        <div>ID: {row.id}</div>
                        <div>Open: {new Date(Date.parse(row.open + "Z")).toLocaleString()}</div>
                        <div>Close: {new Date(Date.parse(row.close + "Z")).toLocaleString()}</div>
                        <div>Duration: {formatDuration(row.duration)}</div>
                        <div>Amount: {formatAmount(parseFloat(row.amount), "bitcoin", 8)}</div>
                        <div>Rate: {(100 * parseFloat(row.rate)).toFixed(4)}%</div>
                        <div>Interest: {formatAmount(parseFloat(row.interest), this.props.unit)}</div>
                        <div>Fee: {formatAmount(parseFloat(row.fee), this.props.unit)}</div>
                        <div>Earned: {formatAmount(parseFloat(row.earned), this.props.unit)}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
        </tbody>
      </table>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Balance unit={this.props.units.balance} />
        <Earnings unit={this.props.units.earnings} />
        <Loans unit={this.props.units.earnings} />
      </Fragment>
    );
  }
}

export default Home;
