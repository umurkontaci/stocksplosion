/**
 * Created by umurkontaci on 5/14/15.
 */
import React from 'react'
import CompanyElement from './CompanyElement.jsx'

export default React.createClass({
  getInitialState() {
    return {
      selectedCompany: null
    };
  },
  handleSelectCompany(company) {
    console.log(company);
    this.setState({
      selectedCompany: company
    });
    window.emitter.emit('selectedCompanyChange', company);
  },
  renderCompanyElement(company) {
    return <CompanyElement key={company.symbol}
                           company={company}
                           selected={company === this.state.selectedCompany}
                           clickHandler={() => this.handleSelectCompany(company)} />;
  },
  render() {
    return <ul>{this.props.companies.map(this.renderCompanyElement)}</ul>;
  }
});