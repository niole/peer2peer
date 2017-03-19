import React, { PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import {
  setSessionSubView,
  setAvailableSessions,
  setCurrentSession,
  setQuestionSubview,
} from '../actions.js';
import {
  ANSWER_QUESTIONS_VIEW,
  VIEW_ANSWERS_VIEW,
  PICK_SESSION_VIEW,
  PICK_PEER_TO_REVIEW_VIEW,
  EDITABLE_QS_VIEW,
  READ_ONLY_QS_VIEW,
  PICK_PEER_TO_READ_VIEW,
  READ_PEERS_REVIEWS_VIEW,
} from '../constants.js';
import {
  VIEW_TO_HEADER_MAP,
  HEADER_TO_VIEW_MAP,
} from '../constants.js';
import MUIBaseTheme from './MUIBaseTheme.jsx';

const { object, string, arrayOf } = PropTypes;

const propTypes = {
  headers: arrayOf(string.isRequired).isRequired,
  elementClickHandlers: object.isRequired,
};

class ReviewSessions extends MUIBaseTheme {
  constructor() {
    super();

    this.ifCreatorElseReviewer = this.ifCreatorElseReviewer.bind(this);
    this.toSession = this.toSession.bind(this);
    this.toReviewed = this.toReviewed.bind(this);
    this.toQuestions = this.toQuestions.bind(this);
  }

  componentDidMount() {
    const {
      userId,
      setAvailableSessions,
    } = this.props;

    const url = `routes/reviewsession/${userId}/`;
    $.ajax({
      url,
      success: d => {
        console.error('success');
        setAvailableSessions(d);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  /**
   * depending on main view type
   * sends user to a view with all peers in session
   * or sends user to view with all peers in session
   * except self
   */
  toSession(sessionId) {
    const {
      userId,
      setCurrentSession,
    } = this.props;

    //get reviewable peers
    const url = `routes/reviewers/${userId}/${sessionId}/`;
    $.ajax({
      url,
      success: reviewers => {
        this.ifCreatorElseReviewer(
          () => setCurrentSession(sessionId, reviewers, PICK_PEER_TO_READ_VIEW),
          () => setCurrentSession(sessionId, reviewers, PICK_PEER_TO_REVIEW_VIEW)
        );
      },
      error: err => {
        console.error(err);
      },
    });
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
      return isReadable();
    }
    else if (mainView === ANSWER_QUESTIONS_VIEW) {
      return isEditable();
    }
  }


  /**
   * sends user to Q/A view, where answers are
   * editable if user is not session creator
   * and are not editable if user is session creator
   */
  toQuestions() {
    const {
      setQuestionSubview,
      currentSessionId,
    } = this.props;

    const url = this.ifCreatorElseReviewer(() => "", () => `routes/questions/${currentSessionId}/`);
    $.ajax({
      url,
      success: qs => {
        this.ifCreatorElseReviewer(
          () => setQuestionSubview(READ_ONLY_QS_VIEW, qs),
          () => setQuestionSubview(EDITABLE_QS_VIEW, qs)
        );
      },
      error: err => {
        console.error(err);
      },
    });
  }

  getHeaders() {
    const {
      sessionView,
      headers,
      setSessionSubView,
    } = this.props;
    const headerIndex = headers.indexOf(VIEW_TO_HEADER_MAP[sessionView])
    const usedHeaders = headers.slice(0, headerIndex+1);

    return usedHeaders.map((header, i) => {
      let title = header;

      if (i === headerIndex) {
        title = `*${header}*`;
      }

      return (
        <div
          key={ header }
          onClick={ () => setSessionSubView(HEADER_TO_VIEW_MAP[header]) }
        >
          { title }
        </div>
      );
    });
  }

  renderSessions() {
    const {
      sessions,
    } = this.props;

    return sessions.map(d => (
        <div
          title="click to start reviewing your peers"
          onClick={ () => this.toSession(d.id) }
          key={ d.id }>
          session: { d.id }
          deadline: { d.deadline }
        </div>
      )
    );
  }

  renderReviewablePeers() {
    const {
      mainView,
      peers,
    } = this.props;

    if (mainView === ANSWER_QUESTIONS_VIEW) {
      return peers.map(d => (
          <li
            title={ `click to review ${d.name}` }
            onClick={ this.toQuestions }
            key={ d.id }>
            peer: { d.name }
          </li>
        )
      );
    }

    if (mainView === VIEW_ANSWERS_VIEW) {
      return peers.map(d => (
          <li
            title="click to read completed reviews"
            onClick={ () => this.toSession(d.id) }
            key={ d.id }>
            session: { d.id }
            deadline: { d.deadline }
          </li>
        )
      );
    }

  }

  renderEditableQs() {
    const {
      questions,
    } = this.props;

    return questions.map(q => (
      <li>
        question: { q.content }
        answer:
        <input placeholder="answer the question"/>
      </li>
    ));
  }

  getContents() {
    const {
      sessionView,
    } = this.props;

    console.log('sessionView', sessionView);

    switch (sessionView) {
      case PICK_SESSION_VIEW:
        return this.renderSessions();
      case PICK_PEER_TO_REVIEW_VIEW:
        return this.renderReviewablePeers();
      case EDITABLE_QS_VIEW:
        return this.renderEditableQs();
      case READ_ONLY_QS_VIEW:
      case PICK_PEER_TO_READ_VIEW:
      case READ_PEERS_REVIEWS_VIEW:
      default:
        return <div/>;
    }

  }

  render() {
    return (
      <div>
        { this.getHeaders() }
        <ol>{ this.getContents() }</ol>
      </div>
    );
  }
}

ReviewSessions.propTypes = propTypes;

const mapStateToProps = state => {
  const {
    sessionView,
    questions,
    answers,
    peers,
    userId,
    reviewerId,
    sessions,
    mainView,
    currentSessionId,
  } = state;

  return {
    currentSessionId,
    mainView,
    reviewerId,
    sessionView,
    questions,
    answers,
    peers,
    userId,
    sessions,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setQuestionSubview: (viewType, qs) => dispatch(setQuestionSubview(viewType, qs)),
    setAvailableSessions: ss => dispatch(setAvailableSessions(ss)),
    setCurrentSession: (sessionId, reviewers, view) => dispatch(setCurrentSession(sessionId, reviewers, view)),
    setSessionSubView: view => dispatch(setSessionSubView(view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewSessions)
