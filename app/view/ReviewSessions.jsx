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
  MET_EXPECTATIONS_LABEL,
  FAILED_EXPECTATIONS_LABEL,
  EXCEEDED_EXPECTATIONS_LABEL,
  START_STOP_CONTINUE_LABEL,
  PICK_PEERS_SUB_HEADER,
  REVIEW_DEADLINE_SUB_HEADER,
  NO_SESSIONS_TO_REVIEW_HEADER,
  NOT_COMPLETED_REVIEW_HEADER,
  READ_PEERS_REVIEWS_TITLES,
  ANSWER_Q_PLACEHOLDER,
  ANSWERS_SUB_HEADER,
  QUESTIONS_SUB_HEADER,
  REVIEW_SESSIONS_SUB_HEADER,
  ANSWER_QUESTIONS_VIEW,
  VIEW_ANSWERS_VIEW,
  PICK_SESSION_VIEW,
  PICK_PEER_TO_REVIEW_VIEW,
  EDITABLE_QS_VIEW,
  READ_ONLY_QS_VIEW,
  PICK_PEER_TO_READ_VIEW,
  READ_PEERS_REVIEWS_VIEW,
  REVISIT_SECTION_TITLE,
  REVIEW_PEERS_TITLE,
  READ_REVIEWS_ABOUT_LABEL,
} from '../constants.js';
import {
  VIEW_TO_HEADER_MAP,
  HEADER_TO_VIEW_MAP,
} from '../constants.js';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import DebouncedInput from './DebouncedInput.jsx';


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

  componentWillReceiveProps(nextProps) {
    if (nextProps.mainView !== this.props.mainView) {
      this.ifCreatorElseReviewer(this.getReviewSessionToRead, this.getReviewSessionToEdit, nextProps);
    }
  }

  /**
   * sets up basic client side state for view only or editable questions view
   */
  componentDidMount() {
    this.ifCreatorElseReviewer(this.getReviewSessionToRead, this.getReviewSessionToEdit);
  }

  /**
   * sets up basic client side state for view only questions view
   */
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

  /**
   * sets up basic client side state for editable questions view
   */
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
  toSession(sessionId = this.props.currentSessionId, session = this.props.currentSession) {
    const {
      userId,
      setCurrentSession,
    } = this.props;

    //get reviewable peers
    const url = `routes/reviewers/${userId}/${sessionId}/`;
    $.ajax({
      url,
      success: data => {
        this.ifCreatorElseReviewer(
          () => setCurrentSession(sessionId, session, data, PICK_PEER_TO_READ_VIEW),
          () => setCurrentSession(sessionId, session, data, PICK_PEER_TO_REVIEW_VIEW)
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
  toReviewed(peerId = this.props.reviewerId, peer = this.props.reviewer) {
    const {
      currentSessionId,
      setReviewer,
    } = this.props;

    const url = `routes/reviewed/${currentSessionId}/${peerId}/`;
    $.ajax({
      url,
      success: reviewed => {
        setReviewer(peer, reviewed, READ_PEERS_REVIEWS_VIEW);
      },
      error: err => {
        console.error(err);
      },
    });
  }

  /**
   * higher order function that executes arguments depending on
   * the current main view
   */
  ifCreatorElseReviewer(isReadable, isEditable, props = this.props) {
    const {
      mainView,
    } = props;

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
      userId,
    } = this.props;
    const reviewer = reviewerId || userId;
    const url = `routes/questions/answers/${reviewer}/${peerId}/${currentSessionId}`;

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

  formatHeaderWithReviewerName(header) {
    const {
      reviewer,
    } = this.props;

    if (reviewer) {
      return `${header} ${reviewer.name}`;
    }
    return header;
  }

  /**
   * breadcrumb headers for sub view
   */
  getHeaders() {
    const {
      sessionView,
      headers,
    } = this.props;
    const headerIndex = headers.indexOf(VIEW_TO_HEADER_MAP[sessionView])
    const usedHeaders = headers.slice(0, headerIndex+1);

    return usedHeaders.map((header, i) => {
      const isFocused = i === headerIndex;
      const focusedClass = isFocused ? " focused" : "";
      const title = READ_REVIEWS_ABOUT_LABEL === header ?
        this.formatHeaderWithReviewerName(header) :
        header;

      return (
        <div
          className={ `bc-header${focusedClass}` }
          key={ header }
          title={ REVISIT_SECTION_TITLE }
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

  /**
   * renders sessions currently viewable
   */
  renderSessions() {
    const {
      sessions,
    } = this.props;


    return (
      <div>
        { this.renderSubviewHeaders(REVIEW_SESSIONS_SUB_HEADER, REVIEW_DEADLINE_SUB_HEADER) }
        {
          sessions.length ?
          sessions.map(d => (
            <li
              title={ REVIEW_PEERS_TITLE }
              onClick={ e => {
                e.preventDefault();
                this.toSession(d.id, d)
              }}
              key={ d.id }>
              <div className="qa-section">
                <div className="subview-content">
                  { d.name }
                </div>
              </div>
              <div className="qa-section">{ d.deadline }</div>
            </li>
          )) :
          NO_SESSIONS_TO_REVIEW_HEADER
        }
      </div>
    );
  }

  /**
   * indicator function determining if this peer has been reviewed yet
   */
  hasBeenReviewed(reviewed, peer) {
    return !!reviewed.find(r => r.reviewedId === peer.id.toString());
  }

  /**
   * renders peers that can be reviewable
   */
  renderReviewablePeers() {
    const {
      sessionView,
      mainView,
      peers,
      userId,
      reviewed,
      currentSession,
    } = this.props;

    const currDeadline = typeof currentSession.deadline === "string" ?
      new Date(currentSession.deadline) :
      currentSession.deadline;

    if (mainView === ANSWER_QUESTIONS_VIEW) {
      return (
        <div>
          { this.renderSubviewHeaders(PICK_PEERS_SUB_HEADER) }
            { peers.map(d => {
              const canStillReview = this.hasBeenReviewed(reviewed, d) || currDeadline.getTime() > new Date().getTime();
              const reviewedClass = !canStillReview ? " reviewed-peer" : "";
              return (
                <div
                  title={ !canStillReview ? `${d.name} can no longer be reviewed` : `click to review ${d.name}` }
                  onClick={ e => {
                    e.preventDefault();
                    if (canStillReview) {
                      this.toQuestions(d.id)
                    }
                  }}
                  key={ d.id }>
                  <div className="qa-header">
                    <div className={ `subview-content${reviewedClass}` }>
                      { d.name }
                    </div>
                  </div>
                </div>
              );
            }) }
        </div>
      );
    }

    if (mainView === VIEW_ANSWERS_VIEW) {
      return peers.map(d => (
          <li
            title={ READ_PEERS_REVIEWS_TITLES }
            onClick={ e => {
              e.preventDefault();
              this.getPeerClickHandler()(d.id, d)
            }}
            key={ d.id }>
            <div className="qa-header">
              <div className="subview-content">
                { d.name }
              </div>
            </div>
          </li>
        )
      );
    }

  }

  /**
   * gets appropriate click handler for read only peers view
   */
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

  /**
   * handles adding answer to client state when user saves answer
   * in editable answers view
   */
  addAnswer(index, content) {
    const {
      questions,
      addAnswer,
      userId,
      reviewedId,
      currentSessionId,
    } = this.props;

    const answer = {
      answerType: questions[index].questionType,
      questionId: questions[index].id.toString(),
      reviewSessionId: currentSessionId.toString(),
      content,
      reviewerId: userId,
      peerId: reviewedId.toString(),
    };

    addAnswer(answer);
  }

  renderSubviewHeaders(header1, header2 = "") {
    return (
        <div className="qa-header">
          <div className="qa-section">
            { header1 }
          </div>
          <div className="qa-section">
            { header2 }
          </div>
        </div>
    );
  }

  getCheckbox(changeHandler, label, questionIndex, defaultValue, groupName) {
    let checkbox = (
        <input
          name={ groupName }
          key={ label }
          onChange={ () => changeHandler(label) }
          type="radio"
          value={ label }
          />
    );

    if (defaultValue === label) {
      checkbox = (
          <input
            name={ groupName }
            key={ label }
            onChange={ () => changeHandler(label) }
            type="radio"
            checked={ "checked" }
            value={ label }
          />
      );

    }

    return (
      <div key={ label }>
        { checkbox }
        <label
          htmlFor={ label }>
          { label }
        </label>
      </div>
    );
  }

  getEditableQInput(questionType, questionIndex, oldAnswer) {
    switch(questionType) {
      case "emf":
        return [MET_EXPECTATIONS_LABEL, EXCEEDED_EXPECTATIONS_LABEL, FAILED_EXPECTATIONS_LABEL]
          .map(label => this.getCheckbox(
              (inputData) => this.addAnswer(questionIndex, inputData),
              label,
              questionIndex,
              oldAnswer ? oldAnswer.content : null,
              "emf"
            )
          );
      case "ssc":
        return (
          <DebouncedInput
            className="answer-input"
            boundFunction={ (inputData) => this.addAnswer(questionIndex, inputData) }
            activeClass="active"
            defaultValue={ oldAnswer ? oldAnswer.content : "" }
            placeholder={ START_STOP_CONTINUE_LABEL }
          />
        );
      case "open":
        return (
          <DebouncedInput
            className="answer-input"
            boundFunction={ (inputData) => this.addAnswer(questionIndex, inputData) }
            activeClass="active"
            defaultValue={ oldAnswer ? oldAnswer.content : "" }
            placeholder={ ANSWER_Q_PLACEHOLDER }
          />
        );
      default:
        return (
          <DebouncedInput
            className="answer-input"
            boundFunction={ (inputData) => this.addAnswer(questionIndex, inputData) }
            activeClass="active"
            defaultValue={ oldAnswer ? oldAnswer.content : "" }
            placeholder={ ANSWER_Q_PLACEHOLDER }
          />
        );
    }
  }

  /**
   * renders editable answers views with questions
   */
  renderEditableQs() {
    const {
      questions,
      answers,
    } = this.props;

    return (
      <div>
        { this.renderSubviewHeaders(QUESTIONS_SUB_HEADER, ANSWERS_SUB_HEADER) }
        { questions.map((q, i) => {
          const answer = answers.find(a => a.questionId === q.id.toString());

          return (
            <li key={ q.id }>
              <div className="qa-section">
                <div className="subview-content question">
                  { q.content }
                </div>
              </div>
              <div className="qa-section">
                { this.getEditableQInput(q.questionType, i, answer) }
              </div>
            </li>
          );
        }) }
      </div>
    );
  }

  /**
   * renders view only questions and answers
   */
  renderReadableQs() {
    const {
      questions,
      answers,
    } = this.props;

    if (answers.length) {
      return (
        <div>
          { this.renderSubviewHeaders(QUESTIONS_SUB_HEADER, ANSWERS_SUB_HEADER) }
          { questions.map((q, i) => (
              <li key={ q.id }>
                <div className="qa-section">
                  <div className="subview-content question">
                    { q.content }
                  </div>
                </div>
                <div className="qa-section">
                  { answers.find(a => a.questionId === q.id.toString()).content }
                </div>
              </li>
            )) }
        </div>
      );
    }
    return NOT_COMPLETED_REVIEW_HEADER;
  }

  /**
   * gets sub view contents
   */
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
        <div id="subview-content">
          { this.getContents() }
        </div>
      </div>
    );
  }
}

ReviewSessions.propTypes = propTypes;

const mapStateToProps = state => {
  const {
    currentSession,
    reviewer,
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
    reviewed,
  } = state;

  return {
    reviewer,
    reviewed,
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
    currentSession,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setReviewer: (reviewer, reviewedUsers, view) => dispatch(setReviewer(reviewer, reviewedUsers, view)),
    addAnswer: ans => dispatch(addAnswer(ans)),
    setQuestionSubview: (viewType, qs, peerId) => dispatch(setQuestionSubview(viewType, qs, peerId)),
    setAvailableSessions: ss => dispatch(setAvailableSessions(ss)),
    setCurrentSession: (sessionId, session, reviewers, view) => dispatch(setCurrentSession(sessionId, session, reviewers, view)),
    setSessionSubView: view => dispatch(setSessionSubView(view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewSessions)
