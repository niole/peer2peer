import React, { PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  submitAnswers,
} from '../actions.js';
import {
  SUBMIT_ANSWERS_LABEL,
} from '../constants.js';


class CreateSessionButton extends MUIBaseTheme {
  constructor() {
    super();
    this.submitSessionData = this.submitSessionData.bind(this);
  }

  submitSessionData() {
    const {
      submitAnswers,
      answeredAll,
      answers,
    } = this.props;

    if (answeredAll) {
      const url = 'routes/answers/submit/';
      $.ajax({
        type: "POST",
        url,
        data: { answers },
        success: reviewed => {
          submitAnswers(reviewed);
        },
        error: err => {
          console.error(err);
        },
      });
    }
  }

  render() {
    const {
      answeredAll,
    } = this.props;

    return (
      <button
        className="footer-submit-button"
        disabled={ !answeredAll }
        onClick={ this.submitSessionData }>
        { SUBMIT_ANSWERS_LABEL }
      </button>
    );
  }
}

const mapStateToProps = state => {
  const {
    currentSessionId,
    answers,
    reviewedId,
    userId,
    questions,
  } = state;

  return {
    currentSessionId,
    answeredAll: answers.length === questions.length && questions.length > 0,
    answers,
    reviewedId,
    userId,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitAnswers: reviewed => dispatch(submitAnswers(reviewed)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSessionButton)

