import repo from './repository.es6'
import moment from 'moment'
import Chart from 'chart.js'
import _ from 'lodash'

const WAIT_THRESHOLD = 0.015;

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
  suggestAction(base, current) {
    let v = base * WAIT_THRESHOLD;
    let top = base + v;
    let bottom = base - v;

    if (current > top) {
      return 'Sell';
    } else if (current <= top && current >= bottom) {
      return 'Wait';
    } else {
      return 'Buy';
    }
  },
  updateDetails(props) {
    repo.getDetail(props.company.symbol, this.state.startDate, this.state.endDate).then((details) => {
      this.setState({
        loaded: true,
        details,
        graphData: this.parsePriceData(details.prices)
      });
    }, (error) => {
      this.setState({
        failed: true,
        error
      });
    });
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.company !== nextProps.company) {
      this.setState({
        loaded: false,
        failed: false,
        details: null
      });
      this.updateDetails(nextProps);
    }
  },
  parsePriceData(data) {
    let labels = [];
    let actualPrices = [];
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        labels.push(key);
        actualPrices.push(data[key]);
      }
    }
    let mean = _.sum(actualPrices) / actualPrices.length;
    let means = [];
    for (let i = 0; i < actualPrices.length; i++) {
      means.push(mean);
    }
    this.setState({
      suggestion: this.suggestAction(mean, _.last(actualPrices))
    });
    return {
      labels: labels.map((l) => moment(l, 'YYYYMMDD').format('MMM D')),
      datasets: [
        {
          label: "Actual",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: actualPrices
        },
        {
          label: "Predicted",
          fillColor: "rgba(200,30,30,0.0)",
          strokeColor: "rgba(200,30,30,1)",
          pointColor: "rgba(200,30,30,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(200,30,30,1)",
          data: means
        }
      ]
    }
  },
  componentDidUpdate() {
    if (this.state.loaded) {
      this.ctx = this.getDOMNode().querySelector('canvas').getContext('2d');
      this.chart = new Chart(this.ctx).Line(this.state.graphData);
    }
  },
  componentDidMount() {
    this.updateDetails(this.props);
  },

  render() {
    let suggestionBtn;
    switch (this.state.suggestion) {
      case 'Buy':
        suggestionBtn = <button className="btn btn-success">{this.state.suggestion}</button>;
        break;
      case 'Wait':
        suggestionBtn = <button className="btn btn-warning">{this.state.suggestion}</button>;
        break;
      case 'Sell':
        suggestionBtn = <button className="btn btn-danger">{this.state.suggestion}</button>;
        break;
      default:
        suggestionBtn = <div />;
        break;
    }
    if (this.state.loaded) {
      return <div>
        <h1>{this.props.company.name} - {this.props.company.symbol}</h1>
        <canvas width="600" height="400"/>
        {suggestionBtn}
      </div>
    } else if (this.state.failed) {
      return <div>Error {this.error}</div>
    } else {
      return <div>Loading {this.props.company.name}</div>
    }
  }
});