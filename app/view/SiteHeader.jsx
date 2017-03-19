import React, { PropTypes } from 'react';
import MUIBaseTheme from './MUIBaseTheme.jsx';


const { arrayOf, string } = PropTypes;
const propTypes = {
  headers: arrayOf(string.isRequired).isRequired,
  focused: string.isRequired,
};

/**
 * A controlled component that indicates the currently viewed page
 */
class SiteHeader extends MUIBaseTheme {
  constructor() {
    super();
  }

  renderHeaders() {
    const {
      headers,
      focused,
    } = this.props;

    return headers.map(header => {
      const isFocused = header === focused;
      return (
        <div key={ header } style={{ color: isFocused ? "green" : "black" }}>
          { header }
        </div>
      );
    });
  }

  render() {

    return (
      <header>
        { this.renderHeaders() }
      </header>
    );
  }
}

SiteHeader.propTypes = propTypes;
export default SiteHeader;
