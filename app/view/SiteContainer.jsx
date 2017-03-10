import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  REVIEWER_LABEL,
  VIEW_ANSWERS_VIEW,
  CREATE_SESSION_VIEW,
  ANSWER_QUESTIONS_VIEW,
  PICK_SESSION_LABEL,
  SESSION_LABEL,
  EDITABLE_QS_LABEL,
  VIEW_ONLY_QS_LABEL,
} from '../constants.js';
import CreateReviewSession from './CreateReviewSession.jsx';
import ReviewSessions from './ReviewSessions.jsx';



class SiteContainer extends MUIBaseTheme {
  /**
   * depending on main view type
   * sends user to a view with all peers in session
   * or sends user to view with all peers in session
   * except self
   */
  toSession() {
  }

  /**
   * only used when session creator views reviews from peers in
   * session, which user created
   */
  toReviewed() {
  }

  /**
   * sends user to Q/A view, where answers are
   * editable if user is not session creator
   * and are not editable if user is session creator
   */
  toQuestions() {
  }

  getViewAnswersView() {
    return (
      <ReviewSessions
        type={ VIEW_ANSWERS_VIEW }
        headers={[
          PICK_SESSION_LABEL,
          SESSION_LABEL,
          REVIEWER_LABEL,
          VIEW_ONLY_QS_LABEL,
        ]}
        elementClickHandlers={[
          this.toSession,
          this.toReviewed,
          this.toQuestions,
        ]}
      />
    );
  }

  getCurrentView() {
    const {
      mainView,
    } = this.props;

    switch (mainView) {
      case VIEW_ANSWERS_VIEW:
        return this.getViewAnswersView();
      case CREATE_SESSION_VIEW:
        return <CreateReviewSession/>;
      case ANSWER_QUESTIONS_VIEW:
        return <ReviewSessions type={ ANSWER_QUESTIONS_VIEW }/>;
      default:
        return <CreateReviewSession/>;
    }

  }

  render() {
    return (
      <div>
        <header>
        </header>
          { this.getCurrentView() }
        <footer>
        </footer>
      </div>

    );
  }
}

const stateToProps = state => {
  const {
    mainView,
  } = state;

  return {
    mainView,
  };
};

export default connect()(SiteContainer)
