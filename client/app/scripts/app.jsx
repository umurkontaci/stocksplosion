import "babel/polyfill";
import repo from './repository.es6'
import CompanyList from './CompanyList.jsx'
import AppDispatcher from './AppDispatcher.jsx'
import CompanyStore from './CompanyStore.es6'
import CompanyGraph from './CompanyGraph.jsx'
import AutoComplete from './AutoComplete.jsx'

import EventEmitter from 'wolfy87-eventemitter'


console.log('Hello');

repo.configure({
  rootUrl: 'http://stocksplosion.apsis.io'
  //rootUrl: 'http://localhost:8001'
});

//let appDispatcher = new AppDispatcher();
//let companyStore = new CompanyStore(appDispatcher);

window.emitter = new EventEmitter();

let App = React.createClass({
  getInitialState() {
    return {
      companies: [],
      loaded: false
    }
  },
  selectedCompanyChangeHandler(company) {
    this.setState({selectedCompany: company});
  },
  componentDidMount() {
    this.listener = window.emitter.on('selectedCompanyChange', this.selectedCompanyChangeHandler);

    repo.getAll().then((companies) => {
      this.setState({
        companies,
        loaded: true
      });
    }, (error) => {
      this.setState({
        failed: true,
        error
      });
    });
  },
  componentWillUnmount() {
    window.emitter.off('selectedCompanyChange', this.selectedCompanyChangeHandler);
  },
  render() {
    let companyGraph = (
      <div className="col-md-6 col-md-offset-3">
        <CompanyGraph company={this.state.selectedCompany}/>
      </div>);
    let companyList = (
      <div className="col-md-12">
        <CompanyList selectedCompany={this.state.selectedCompany} companies={this.state.companies}/>
      </div>);
    let help = (
      <div className="col-md-12 text-center">
        <p className="lead">Enter a company name to see its recent prices.</p>
      </div>
    );
    let g;
    if (this.state.selectedCompany) {
      g = companyGraph
    } else {
      g = help
    }
    if (this.state.loaded) {
      return (
        <div>
          <div className="row">
            {companyList}
          </div>
          <div className="row">{g}</div>
        </div>);
    } else if (this.state.failed) {
      return <div>Error: {this.error}</div>
    } else {
      return <div>Loading</div>
    }
  }
});

React.render(<App />, document.getElementById('main'));


