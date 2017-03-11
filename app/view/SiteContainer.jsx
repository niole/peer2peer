import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  setCurrentSession,
  setSessionSubView,
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



class SiteContainer extends MUIBaseTheme {
  constructor() {
    super();

    this.toSession = this.toSession.bind(this);
    this.toReviewed = this.toReviewed.bind(this);
    this.toQuestions = this.toQuestions.bind(this);
    this.ifCreatorElseReviewer = this.ifCreatorElseReviewer.bind(this);


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
   * depending on main view type
   * sends user to a view with all peers in session
   * or sends user to view with all peers in session
   * except self
   */
  toSession(sessionId) {
    const {
      setCurrentSession,
    } = this.props;

    this.ifCreatorElseReviewer(
      setCurrentSession(sessionId, PICK_PEER_TO_READ_VIEW),
      setCurrentSession(sessionId, PICK_PEER_TO_REVIEW_VIEW)
    );
  }

  /**
   * review session creator can look at peers reviewed by
   * selected peer
   */
  toReviewed() {
    const {
      setSessionSubView,
    } = this.props;

    this.ifCreatorElseReviewer(
      () => setSessionSubView(READ_PEERS_REVIEWS_VIEW),
      () => {},
    );

  }

  ifCreatorElseReviewer(isReadable, isEditable) {
    const {
      mainView,
    } = this.props;

    if (mainView === VIEW_ANSWERS_VIEW) {
      isReadable();
    }
    else if (mainView === ANSWER_QUESTIONS_VIEW) {
      isEditable();
    }
  }


  /**
   * sends user to Q/A view, where answers are
   * editable if user is not session creator
   * and are not editable if user is session creator
   */
  toQuestions() {
    const {
      setSessionSubView,
    } = this.props;

    this.ifCreatorElseReviewer(
      () => setSessionSubView(READ_ONLY_QS_VIEW),
      () => setSessionSubView(EDITABLE_QS_VIEW)
    );
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
        return this.getAnswerQuestionsView();
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
    setSessionSubView: view => dispatch(setSessionSubView(view)),
    setCurrentSession: (id, view) => dispatch(setCurrentSession(id, view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteContainer)
