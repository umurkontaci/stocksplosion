import "babel/polyfill";
import repo from './repository.es6'
import React from 'react'
import CompanyList from './CompanyList.jsx'
import AppDispatcher from './AppDispatcher.jsx'
import CompanyStore from './CompanyStore.es6'
import EventEmitter from 'wolfy87-eventemitter';

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
    if (this.state.loaded) {
      return <CompanyList companies={this.state.companies} />;
    } else if (this.state.failed) {
      return <div>Error: {this.error}</div>
    } else {
      return <div>Loading</div>
    }
  }
});

React.render(<App />, document.getElementById('main'));


