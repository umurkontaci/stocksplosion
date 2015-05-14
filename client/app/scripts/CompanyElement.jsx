export default React.createClass({
  renderText() {
    if (this.props.selected) {
      return <b>{this.props.company.name}</b>
    } else {
      return <span>{this.props.company.name}</span>
    }
  },
  render() {
    return <li onClick={this.props.clickHandler}>{this.renderText()}</li>;
  }
});
