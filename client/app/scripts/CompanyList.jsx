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
  getDataSet() {
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
      <div className="col-md-6 col-md-offset-3">
        <AutoComplete highlight={true}
                      minLength="0"
                      onSelect={this.handleSelectCompany}
                      dataset={this.getDataSet()}
                      value={this.getDataSet().display(this.state.selectedCompany)}
          />
      </div>
    );
  }
});