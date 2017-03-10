import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  VIEW_ANSWERS_VIEW,
  CREATE_SESSION_VIEW,
  ANSWER_QUESTIONS_VIEW,
} from '../constants.js';
import CreateReviewSession from './CreateReviewSession.jsx';
import ReviewSessions from './ReviewSessions.jsx';



class SiteContainer extends MUIBaseTheme {
  getCurrentView() {
    const {
      mainView,
    } = this.props;

    switch (mainView) {
      case VIEW_ANSWERS_VIEW:
        return <ReviewSessions type={ VIEW_ANSWERS_VIEW }/>;
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
