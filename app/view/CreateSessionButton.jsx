import React, { PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  submitNewSession,
} from '../actions.js';
import {
  CREATE_SESSION_BTN_LABEL,
} from '../constants.js';


class CreateSessionButton extends MUIBaseTheme {
  constructor() {
    super();
    this.submitSessionData = this.submitSessionData.bind(this);
  }

  submitSessionData() {
    const {
      questions,
      sessionPeers,
      currentSessionDeadline,
      userId,
      submitNewSession,
    } = this.props;

    const url = 'routes/reviewsession/create/';
    $.ajax({
      type: "POST",
      url,
      data: {
        reviewers: sessionPeers,
        deadline: currentSessionDeadline,
        creatorId: userId,
        questions,
      },
      success: () => {
        console.log('success');
        submitNewSession();
      },
      error: err => {
        console.error(err);
      },
    });
  }

  render() {
    return (
      <button onClick={ this.submitSessionData }>{ CREATE_SESSION_BTN_LABEL }</button>
    );
  }
}

const mapStateToProps = state => {
  const {
    questions,
    sessionPeers,
    currentSessionDeadline,
    userId,
  } = state;

  return {
    userId,
    questions,
    sessionPeers,
    currentSessionDeadline,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitNewSession: () => dispatch(submitNewSession()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSessionButton)
