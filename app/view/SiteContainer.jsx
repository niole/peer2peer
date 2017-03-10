import React, { PropTypes } from 'react';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import {
  VIEW_ANSWERS_VIEW,
  CREATE_SESSION_VIEW,
  ANSWER_QUESTIONS_VIEW,
} from '../constants.js';



class SiteContainer extends MUIBaseTheme {
  getCurrentView() {
    const {
      mainView,
    } = this.props;

    switch (mainView) {
      case VIEW_ANSWERS_VIEW:
      case CREATE_SESSION_VIEW:
      case ANSWER_QUESTIONS_VIEW:
      default:
        //create session view
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
