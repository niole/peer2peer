import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import {
  submitNewSession,
} from '../actions.js';
import {
  CREATE_SESSION_BTN_LABEL,
} from '../constants.js';


class CreateSessionButton extends Component {
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
      currentSessionName,
      sessionReviewees,
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
        currentSessionName,
        sessionReviewees,
      },
      success: updatedUser => {
        submitNewSession(updatedUser);
      },
      error: err => {
        console.error(err);
      },
    });
  }

  shouldDisable() {
    const {
      currentSessionName,
      currentSessionDeadline,
      questions,
      sessionPeers,
      sessionReviewees,
    } = this.props;

    return !currentSessionDeadline ||
      !questions.length ||
      !sessionPeers.length ||
      !sessionPeers.every(peer => sessionReviewees[peer.email] && sessionReviewees[peer.email].length) ||
      !currentSessionName;
  }

  render() {
    return (
      <button
        className="footer-submit-button"
        disabled={ this.shouldDisable() }
        onClick={ this.submitSessionData }>
        { CREATE_SESSION_BTN_LABEL }
      </button>
    );
  }
}

const mapStateToProps = state => {
  const {
    questions,
    sessionPeers,
    currentSessionDeadline,
    user,
    currentSessionName,
    sessionReviewees,
  } = state;

  return {
    sessionReviewees,
    currentSessionName,
    userId: user.id.toString(),
    questions,
    sessionPeers,
    currentSessionDeadline,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitNewSession: user => dispatch(submitNewSession(user)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSessionButton)
