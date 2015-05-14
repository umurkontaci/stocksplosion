/**
 * Created by umurkontaci on 5/14/15.
 */
import CompanyElement from './CompanyElement.jsx'
import AutoComplete from './AutoComplete.jsx'

export default React.createClass({
  getInitialState() {
    return {
      selectedCompany: null
    };
  },
  getDataSets() {
    return {
      source: (query, resultFn) => {
        query = query.toLowerCase();
        resultFn(this.props.companies.filter((c) =>
              c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query)))
      },
      display: (company) => company && `${company.name} (${company.symbol})` || ''
    }
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
    return (
      <div>
        <AutoComplete highlight={true}
                      minLength="2"
                      onSelect={this.handleSelectCompany}
                      datasets={this.getDataSets()}
                      value={this.getDataSets().display(this.state.selectedCompany)}
          />
        <ul>{this.props.companies.map(this.renderCompanyElement)}</ul>
      </div>
    );
  }
});