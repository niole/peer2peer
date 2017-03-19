import React, { PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import {
  setSessionSubView,
  setAvailableSessions,
  setCurrentSession,
} from '../actions.js';
import {
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
        console.error('success', d);
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

  getBlocks(data) {
    return data.map(d => <div key={ d.id }>{ JSON.stringify(d) }</div>);
  }

  getContents() {
    const {
      sessionView,
      sessions,
    } = this.props;

    switch (sessionView) {
      case PICK_SESSION_VIEW:
        return this.getBlocks(sessions);
      case PICK_PEER_TO_REVIEW_VIEW:
      case EDITABLE_QS_VIEW:
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
        { this.getContents() }
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
  } = state;

  return {
    reviewerId,
    sessionView,
    questions,
    answers,
    allPeers: peers,
    peersNoReviewer: peers.filter(p => p.id !== reviewerId),
    userId,
    sessions,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setAvailableSessions: ss => dispatch(setAvailableSessions(ss)),
    setCurrentSession: (sessionId, view) => dispatch(setCurrentSession(sessionId, view)),
    setSessionSubView: view => dispatch(setSessionSubView(view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewSessions)
