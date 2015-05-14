export default React.createClass({
  componentWillReceiveProps(nextProps) {
    $(this.getDOMNode()).typeahead('val', nextProps.value);
    $(this.getDOMNode()).typeahead('close');
  },
  handleSelection(e, selection) {
    if (this.props.onSelect) {
      this.props.onSelect(selection);
    }
  },
  componentDidMount() {
    $(this.getDOMNode()).typeahead({
      minLength: this.props.minLength,
      highlight: this.props.highlight
    }, this.props.dataset);
    $(this.getDOMNode()).typeahead('val', this.props.value);

    $(this.getDOMNode()).on('typeahead:select', this.handleSelection);
  },
  componentWillUnmount() {
    $(this.getDOMNode()).off('typeahead:select', this.handleSelection);
    $(this.getDOMNode()).typeahead('destroy');
  },
  render() {
    return <input type="text" className="form-control typeahead" />;
  }
});