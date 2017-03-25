import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import CreateSessionButton from './CreateSessionButton.jsx';
import SubmitAnswersButton from './SubmitAnswersButton.jsx';
import SiteHeader from './SiteHeader.jsx';
import {
  setCurrentSession,
  switchMainView,
  updateUserInfo,
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

  READ_REVIEWS_ABOUT_LABEL,
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

const { string } = PropTypes;
const propTypes = {
  userEmail: string.isRequired,
};

class SiteContainer extends MUIBaseTheme {
  constructor(props) {
    super(props);

    const {
      updateUserInfo,
      userEmail,
    } = props;

    const url = `routes/user/${userEmail}/`;
    $.ajax({
      url,
      success: user => {
        if (user.admin) {
          updateUserInfo(user, CREATE_SESSION_VIEW);
        }
        else {
          updateUserInfo(user, ANSWER_QUESTIONS_VIEW);
        }
      },
      error: err => console.error(err),
    });

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
          READ_PEERS_REVIEWS_LABEL,
          READ_REVIEWS_ABOUT_LABEL,
          VIEW_ONLY_QS_LABEL,
        ]}
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
        return <div/>;
    }

  }

  getSubmitButton(mainView) {
    switch (mainView) {
      case CREATE_SESSION_VIEW:
        return <CreateSessionButton/>;
      case ANSWER_QUESTIONS_VIEW:
        return <SubmitAnswersButton/>;
      default:
        return <div/>;
    }
  }

  render() {
    const {
      switchMainView,
      mainView,
      isAdmin,
    } = this.props;

    return (
      <div>
        <SiteHeader
          headerHandler={ switchMainView }
          headers={
            allSubViews.filter(view => isAdmin ? view !== ANSWER_QUESTIONS_VIEW : view === ANSWER_QUESTIONS_VIEW)
          }
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

SiteContainer.propTypes = propTypes;

const mapStateToProps = state => {
  const {
    isAdmin,
    mainView,
  } = state;

  return {
    isAdmin,
    mainView,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateUserInfo: (user, view) => dispatch(updateUserInfo(user, view)),
    switchMainView: view => dispatch(switchMainView(view)),
    setCurrentSession: (id, view) => dispatch(setCurrentSession(id, view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteContainer)
