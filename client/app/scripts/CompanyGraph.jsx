import React from 'react'
import repo from './repository.es6'
import moment from 'moment'
import Chart from 'chart.js'

export default React.createClass({
  getInitialState() {
    return {
      loaded: false,
      failed: false,
      error: null,
      startDate: moment().subtract(30, 'days').format('YYYYMMDD'),
      endDate: moment().format('YYYYMMDD'),
      details: null
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.company !== nextProps.company) {
      this.setState({
        loaded: false,
        failed: false,
        details: null
      });
    }
    repo.getDetail(nextProps.company.symbol, this.state.startDate, this.state.endDate).then((details) => {
      this.setState({
        loaded: true,
        details
      });
    }, (error) => {
      this.setState({
        failed: true,
        error
      });
    });
  },
  parsePriceData(data) {
    let labels = [];
    let points = [];
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        labels.push(key);
        points.push(data[key]);
      }
    }
    return {
      labels,
      datasets: [
        {
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: points
        }
      ]
    }
  },
  componentDidUpdate() {
    if (this.state.loaded) {
      this.ctx = this.getDOMNode().querySelector('canvas').getContext('2d');
      this.chart = new Chart(this.ctx).Line(this.parsePriceData(this.state.details.prices));
    }
  },
  render() {
    if (this.state.loaded) {
      return <div>
        {this.props.company.name} - {JSON.stringify(this.state.details)}
        <canvas width="600" height="400"/>
      </div>
    } else if (this.state.failed) {
      return <div>Error {this.error}</div>
    } else {
      return <div>Loading...</div>
    }
  }
});