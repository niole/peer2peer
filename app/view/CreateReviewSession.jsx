import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  addQuestions,
  updateSessionPeers,
  updateSessionDeadline,
} from '../actions.js';
import MUIBaseTheme from './MUIBaseTheme.jsx';



class CreateReviewSession extends MUIBaseTheme {
  render() {
  }
}

export default connect()(CreateReviewSession)
