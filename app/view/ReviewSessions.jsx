import React, { PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import {
  setReviewer,
  setSessionSubView,
  setAvailableSessions,
  setCurrentSession,
  setQuestionSubview,
  addAnswer,
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


const { string, arrayOf } = PropTypes;
const propTypes = {
  headers: arrayOf(string.isRequired).isRequired,
};

class ReviewSessions extends MUIBaseTheme {
  constructor() {
    super();

    this.ifCreatorElseReviewer = this.ifCreatorElseReviewer.bind(this);
    this.toSession = this.toSession.bind(this);
    this.toReviewed = this.toReviewed.bind(this);
    this.toQuestions = this.toQuestions.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.getReviewSessionToRead = this.getReviewSessionToRead.bind(this);
    this.getReviewSessionToEdit = this.getReviewSessionToEdit.bind(this);

    this.breadcrumbClickHandlers = {
      [PICK_SESSION_VIEW]: () => this.ifCreatorElseReviewer(this.getReviewSessionToRead, this.getReviewSessionToEdit),
      [PICK_PEER_TO_REVIEW_VIEW]: this.toSession,
      [PICK_PEER_TO_READ_VIEW]: this.toSession,
      [READ_PEERS_REVIEWS_VIEW]: this.toReviewed,
      [EDITABLE_QS_VIEW]: e => { e.preventDefault() },
      [READ_ONLY_QS_VIEW]: e => { e.preventDefault() },
    };

  }

  componentDidMount() {
    this.ifCreatorElseReviewer(this.getReviewSessionToRead, this.getReviewSessionToEdit);
  }

  getReviewSessionToRead() {
    const {
      userId,
      setAvailableSessions,
    } = this.props;

    const url = `routes/reviewsession/createdby/${userId}/`;
    $.ajax({
      url,
      success: d => {
        setAvailableSessions(d);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  getReviewSessionToEdit() {
    const {
      userId,
      setAvailableSessions,
    } = this.props;

    const url = `routes/reviewsession/includes/${userId}/`;
    $.ajax({
      url,
      success: d => {
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
  toSession(sessionId = this.props.currentSessionId) {
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
  toReviewed(peerId = this.props.reviewerId) {
    const {
      currentSessionId,
      setReviewer,
    } = this.props;

    const url = `routes/reviewed/${currentSessionId}/${peerId}/`;
    $.ajax({
      url,
      success: reviewed => {
        console.log('success');
        setReviewer(peerId, reviewed, READ_PEERS_REVIEWS_VIEW);
      },
      error: err => {
        console.error(err);
      },
    });
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
  toQuestions(peerId) {
    const {
      reviewerId,
      setQuestionSubview,
      currentSessionId,
    } = this.props;

    const url = this.ifCreatorElseReviewer(
      () => `routes/questions/answers/${reviewerId}/${peerId}/${currentSessionId}`,
      () => `routes/questions/${currentSessionId}/`
    );

    $.ajax({
      url,
      success: data => {
        this.ifCreatorElseReviewer(
          () => setQuestionSubview(READ_ONLY_QS_VIEW, data, peerId),
          () => setQuestionSubview(EDITABLE_QS_VIEW, data, peerId)
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
          title="click to revisit this section"
          onClick={ e => {
            e.preventDefault();
            this.breadcrumbClickHandlers[HEADER_TO_VIEW_MAP[header]]();
          }}
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
        <li
          title="click to start reviewing your peers"
          onClick={ e => {
            e.preventDefault();
            this.toSession(d.id)
          }}
          key={ d.id }>
          session: { d.id }
          deadline: { d.deadline }
        </li>
      )
    );
  }

  renderReviewablePeers() {
    const {
      sessionView,
      mainView,
      peers,
      userId,
    } = this.props;

    if (mainView === ANSWER_QUESTIONS_VIEW) {
      return peers.map(d => (
          <li
            title={ `click to review ${d.name}` }
            onClick={ e => {
              e.preventDefault();
              this.toQuestions(d.id)
            }}
            key={ d.id }>
            peer: { d.name }
          </li>
        )
      );
    }

    if (mainView === VIEW_ANSWERS_VIEW) {
      return peers.map(d => (
          <li
            title="click to read peer's completed reviews"
            onClick={ e => {
              e.preventDefault();
              this.getPeerClickHandler()(d.id)
            }}
            key={ d.id }>
            name: { d.name }
          </li>
        )
      );
    }

  }

  getPeerClickHandler() {
    const {
      sessionView,
    } = this.props;

    if (sessionView === READ_PEERS_REVIEWS_VIEW) {
      return this.toQuestions;
    }

    if (sessionView === PICK_PEER_TO_READ_VIEW) {
      return this.toReviewed;
    }

    return () => {};
  }

  addAnswer(index) {
    const {
      questions,
      addAnswer,
      userId,
      reviewedId,
      currentSessionId,
    } = this.props;

    const answer = {
      questionId: questions[index].id,
      reviewSessionId: currentSessionId,
      content: this[`answer-${index}`].value,
      reviewerId: userId,
      peerId: reviewedId,
    };

    addAnswer(answer);
  }

  renderEditableQs() {
    const {
      questions,
    } = this.props;

    return questions.map((q, i) => (
      <li>
        question: { q.content }
        answer:
        <input
          ref={ ref => this[`answer-${i}`] = ref }
          placeholder="answer the question"/>
        <button
          onClick={ e => {
            e.preventDefault();
            this.addAnswer(i)
          }}
        >
          Save
        </button>
      </li>
    ));
  }

  renderReadableQs() {
    const {
      questions,
      answers,
    } = this.props;

    if (answers.length) {
      return questions.map((q, i) => (
        <li>
          question: { q.content }
          answer: { answers.find(a => a.questionId === q.id.toString()).content }
        </li>
      ));
    }
    return "This user has not completed this review";
  }

  getContents() {
    const {
      sessionView,
    } = this.props;

    switch (sessionView) {
      case PICK_SESSION_VIEW:
        return this.renderSessions();
      case PICK_PEER_TO_REVIEW_VIEW:
        return this.renderReviewablePeers();
      case EDITABLE_QS_VIEW:
        return this.renderEditableQs();
      case READ_ONLY_QS_VIEW:
        return this.renderReadableQs();
      case PICK_PEER_TO_READ_VIEW:
        return this.renderReviewablePeers();
      case READ_PEERS_REVIEWS_VIEW:
        return this.renderReviewablePeers();
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
    reviewedId,
  } = state;

  return {
    reviewedId,
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
    setReviewer: (reviewerId, reviewedUsers, view) => dispatch(setReviewer(reviewerId, reviewedUsers, view)),
    addAnswer: ans => dispatch(addAnswer(ans)),
    setQuestionSubview: (viewType, qs, peerId) => dispatch(setQuestionSubview(viewType, qs, peerId)),
    setAvailableSessions: ss => dispatch(setAvailableSessions(ss)),
    setCurrentSession: (sessionId, reviewers, view) => dispatch(setCurrentSession(sessionId, reviewers, view)),
    setSessionSubView: view => dispatch(setSessionSubView(view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewSessions)
