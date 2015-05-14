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
  rootUrl: 'http://localhost:8001'
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
    })
  },
  componentWillUnmount() {
    window.emitter.off('selectedCompanyChange', this.selectedCompanyChangeHandler);
  },
  render() {
    let companyGraph = <div className="col-md-6 col-md-offset-3"><CompanyGraph company={this.state.selectedCompany} /></div>;
    let companyList = <div className="col-md-12"><CompanyList companies={this.state.companies} /></div>;
    if (this.state.loaded) {
      if (this.state.selectedCompany) {
        return (
          <div>
            <div className="row">
              {companyList}
            </div>
            <div className="row">
              {companyGraph}
            </div>
        </div>);
      } else {
        return <div className="row">{companyList}</div>;
      }
    } else if (this.state.failed) {
      return <div>Error: {this.error}</div>
    } else {
      return <div>Loading</div>
    }
  }
});

React.render(<App />, document.getElementById('main'));


