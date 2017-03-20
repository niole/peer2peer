import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import CreateSessionButton from './CreateSessionButton.jsx';
import SubmitAnswersButton from './SubmitAnswersButton.jsx';
import SiteHeader from './SiteHeader.jsx';
import {
  setCurrentSession,
  switchMainView,
} from '../actions.js';
import {
  PICK_PEER_TO_REVIEW_VIEW,
  EDITABLE_QS_VIEW,
  READ_ONLY_QS_VIEW,
  PICK_PEER_TO_READ_VIEW,
  READ_PEERS_REVIEWS_VIEW,
  PICK_SESSION_VIEW,

  VIEW_ANSWERS_VIEW,
  CREATE_SESSION_VIEW,
  ANSWER_QUESTIONS_VIEW,

  PICK_SESSION_LABEL,
  PICK_PEER_LABEL,
  EDITABLE_QS_LABEL,
  READ_PEERS_REVIEWS_LABEL,
  VIEW_ONLY_QS_LABEL,
} from '../constants.js';
import CreateReviewSession from './CreateReviewSession.jsx';
import ReviewSessions from './ReviewSessions.jsx';

const allSubViews = [
  VIEW_ANSWERS_VIEW,
  CREATE_SESSION_VIEW,
  ANSWER_QUESTIONS_VIEW,
];


class SiteContainer extends MUIBaseTheme {
  constructor() {
    super();


    this.subViewToElementHandler = {
      [PICK_SESSION_VIEW]: this.toSession,
      [PICK_PEER_TO_REVIEW_VIEW]: this.toQuestions,
      [PICK_PEER_TO_READ_VIEW]: this.toReviewed,
      [READ_PEERS_REVIEWS_VIEW]: this.toQuestions,
      [EDITABLE_QS_VIEW]: () => {},
      [READ_ONLY_QS_VIEW]: () => {},
    };
  }


  /**
   * for viewing answered questions
   * for session creator
   */
  getViewAnswersView() {
    return (
      <ReviewSessions
        headers={[
          PICK_SESSION_LABEL,
          PICK_PEER_TO_READ_VIEW,
          READ_PEERS_REVIEWS_LABEL,
          VIEW_ONLY_QS_LABEL,
        ]}
        elementClickHandlers={ this.subViewToElementHandler }
      />
    );
  }

  getAnswerQuestionsView() {
    return (
      <ReviewSessions
        headers={[
          PICK_SESSION_LABEL,
          PICK_PEER_LABEL,
          EDITABLE_QS_LABEL,
        ]}
        elementClickHandlers={ this.subViewToElementHandler }
      />
    );
  }

  getCurrentView(mainView) {
    switch (mainView) {
      case VIEW_ANSWERS_VIEW:
        return this.getViewAnswersView();
      case CREATE_SESSION_VIEW:
        return <CreateReviewSession/>;
      case ANSWER_QUESTIONS_VIEW:
        return this.getAnswerQuestionsView();
      default:
        return <CreateReviewSession/>;
    }

  }

  getSubmitButton(mainView) {
    switch (mainView) {
      case CREATE_SESSION_VIEW:
        return <CreateSessionButton/>;
      case ANSWER_QUESTIONS_VIEW:
        return <SubmitAnswersButton/>;
      case VIEW_ANSWERS_VIEW:
      default:
        return <div/>;
    }
  }

  render() {
    const {
      switchMainView,
      mainView,
    } = this.props;

    return (
      <div>
        <SiteHeader
          headerHandler={ switchMainView }
          headers={ allSubViews }
          focused={ mainView }
        />
        { this.getCurrentView(mainView) }
        <footer>
          { this.getSubmitButton(mainView) }
        </footer>
      </div>

    );
  }
}

const mapStateToProps = state => {
  const {
    mainView,
  } = state;

  return {
    mainView,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    switchMainView: view => dispatch(switchMainView(view)),
    setCurrentSession: (id, view) => dispatch(setCurrentSession(id, view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteContainer)
