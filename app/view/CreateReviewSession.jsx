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

const mapStateToProps = state => {
  const {
    questions,
    peers,
    userId,
  } = state;

  return {
    questions,
    peers,
    userId,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addQuestions: qs => dispatch(addQuestions(qs)),
    updateSessionPeers: peers => dispatch(updateSessionPeers(peers)),
    updateSessionDeadline: deadline => dispatch(updateSessionDeadline(deadline)),
  };
}

export default connect(
)(CreateReviewSession)
