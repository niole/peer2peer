import React, { PropTypes } from 'react';
import MUIBaseTheme from './MUIBaseTheme.jsx';

const { string, } = PropTypes;

const propTypes = {
  type: string.isRequired, //enum
};

class ReviewSessions extends MUIBaseTheme {
  render() {
    return (
    );
  }
}

ReviewSessions.propTypes = propTypes;

export default ReviewSessions;
