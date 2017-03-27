import React, { PropTypes } from 'react';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  ANSWER_QUESTIONS_VIEW,
  VIEW_TO_HEADER_MAP,
} from '../constants.js';


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

    return headers.map((header, i) => {
      const focusedClass = header === focused ? " focused" : "";
      const oneHeaderClass = header === ANSWER_QUESTIONS_VIEW ? " one" : "";
      return (
        <div
          className={ `main-view-tab${focusedClass}${oneHeaderClass}` }
          onClick={ () => headerHandler(header) }
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
