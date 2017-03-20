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
      answeredAll,
      answers,
      reviewedId,
      userId,
    } = this.props;

    if (answeredAll) {
      const url = 'routes/answers/submit/';
      $.ajax({
        type: "POST",
        url,
        data: { answers },
        success: () => {
          console.log('success');
          submitAnswers();
        },
        error: err => {
          console.error(err);
        },
      });
    }
  }

  render() {
    return (
      <button onClick={ this.submitSessionData }>{ SUBMIT_ANSWERS_LABEL }</button>
    );
  }
}

const mapStateToProps = state => {
  const {
    answers,
    reviewedId,
    userId,
    questions,
  } = state;

  return {
    answeredAll: answers.length === questions.length,
    answers,
    reviewedId,
    userId,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitAnswers: () => dispatch(submitAnswers()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSessionButton)

