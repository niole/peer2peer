import React, { PropTypes } from 'react';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  ANSWER_QUESTIONS_VIEW,
  VIEW_TO_HEADER_MAP,
} from '../constants.js';


const totalHeadersMap = {
  1: " one",
  2: " two",
  3: " three",
};

const { arrayOf, func, string } = PropTypes;
const propTypes = {
  headerHandler: func.isRequired,
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
      headerHandler,
      headers,
      focused,
    } = this.props;
    const totalHeadersClass = totalHeadersMap[headers.length] || "";

    return headers.map((header, i) => {
      const isFocused = header === focused;
      const focusedClass = isFocused ? " focused" : "";

      return (
        <div
          className={ `main-view-tab${focusedClass}${totalHeadersClass}` }
          onClick={ isFocused ? () => {} : () => headerHandler(header) }
          key={ header }
          >
          { VIEW_TO_HEADER_MAP[header] }
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
