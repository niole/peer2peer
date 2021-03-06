import React, { Component } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import DatePicker from 'material-ui/DatePicker';
import {
  removeSessionReviewee,
  addSessionReviewee,
  removePeer,
  addQuestions,
  updateSessionPeers,
  updateSessionDeadline,
  removeQuestion,
  setSessionName,
} from '../actions.js';
import {
  PICK_PEERS_FORM_HEADER,
  CREATE_QUESTIONS_HEADER,
  DEFAULT_QUESTIONS_HEADER,
  OPEN_Q,
  START_STOP_CONTINUE_Q,
  EXCEED_MEET_BELOW_Q,
  START_STOP_CONTINUE_LABEL,
  DATEPICKER_PLACEHOLDER,
  EMF_QUESTION_LABEL,
  NAME_SESSION_LABEL,
} from '../constants.js';
import DebouncedInput from './DebouncedInput.jsx';
import ReviewerGroup from './ReviewerGroup.jsx';


const CAN_TOGGLE_TITLE = "Click to include";


class CreateReviewSession extends MUIBaseTheme {
  constructor() {
    super();

    this.emf = null;
    this.startStopContinue = null;
    this.peerinput = null;
    this.questioninput = null;
    this.sessionName = null;
    this.saveQuestion = this.saveQuestion.bind(this);
    this.addPeer = this.addPeer.bind(this);
    this.addDefaultQuestion = this.addDefaultQuestion.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.questions.length) {
      this.emf.checked = "";
      this.startStopContinue.checked = "";
    }
  }

  saveQuestion(question, questionType, id = Math.random()) {
    const {
      addQuestions,
    }= this.props;

    addQuestions([{
      questionType,
      content: question,
      id,
    }]);
  }

  /**
   * adds peer object to sessionPeers in client state
   * also updates sessionReviewees with mapping from email to empty array
   */
  addPeer() {
    const {
      updateSessionPeers,
    }= this.props;

    const peerEmail = this.peerinput.value;
    const reviewer = this.getPeerObject(peerEmail);

    updateSessionPeers(reviewer);
  }

  /**
   * Gets formatted peer object
   * Works for sessionPeers and sessionReviewees
   */
  getPeerObject(email) {
    return {
      email,
    };
  }

  /**
   * renders currently selected sessionPeer and sessionReviewees, each group of
   * which belongs to a sessionPeer
   */
  renderPeers() {
    const {
      removePeer,
      sessionPeers,
      sessionReviewees,
      addSessionReviewee,
      removeSessionReviewee,
    } = this.props;

    return sessionPeers.map((p, i) => (
      <ReviewerGroup
        key={ `reviewergroup-${i}` }
        peer={ p }
        addRevieweeHander={ addSessionReviewee }
        removeRevieweeHandler={ removeSessionReviewee }
        removeReviewerHander={ removePeer }
        reviewees={ sessionReviewees[p.email] }
        remainingPeers={ sessionPeers.filter(sp => (
          sessionReviewees[p.email].every(reviewee => sp.email !== reviewee.email
        ))) }
      />
    ));
  }

  /**
   * Renders currently selected questions for the ReviewSession in progress
   */
  renderQuestions() {
    const {
      questions,
      removeQuestion,
    } = this.props;

    return questions
      .filter(q => q.questionType !== EXCEED_MEET_BELOW_Q && q.questionType !== START_STOP_CONTINUE_Q)
      .map((q, i) => (
        <div
          className="create-session questions"
          onClick={ () => removeQuestion(q.id) }
          title="click to remove"
          key={ i } >
          { q.content }
        </div>
        )
      );
  }

  renderDeadline() {
    const {
      currentSessionDeadline,
      updateSessionDeadline,
    } = this.props;

    const c = this;

    return (
      <div id="date-picker">
        <DatePicker
          onChange={ (other, date) => updateSessionDeadline(date) }
          defaultDate={ currentSessionDeadline }
          hintText={ DATEPICKER_PLACEHOLDER }
          container="inline"
          mode="landscape"/>
      </div>
    );
  }

  addDefaultQuestion(type) {
    const {
      removeQuestion,
    } = this.props;
    const inputRef = type === START_STOP_CONTINUE_Q ? this.startStopContinue : this.emf;
    const question = type === START_STOP_CONTINUE_Q ? START_STOP_CONTINUE_LABEL : EMF_QUESTION_LABEL;

    if (inputRef.checked) {
      this.saveQuestion(question, type, type);
    }
    else {
      removeQuestion(type);
    }

  }

  render() {
    const {
      setSessionName,
    } = this.props;

    return (
      <div>
        <div>
          <h3 className="create-session-header">
            { NAME_SESSION_LABEL }
          </h3>
          <DebouncedInput
            className="answer-input"
            boundFunction={ setSessionName }
            activeClass="active"
            placeholder="name your session"
          />
          <h3 className="create-session-header">
            { DATEPICKER_PLACEHOLDER }
          </h3>
          <div id="date-picker">
            { this.renderDeadline() }
          </div>
          <h3 className="create-session-header">
            { PICK_PEERS_FORM_HEADER }
          </h3>

          <div className="peers-container">
            { this.renderPeers() }
            <div>
              <input
                ref={(ref) => this.peerinput = ref }
                placeholder="type a peer's email"/>
              <button
                onClick={ this.addPeer }
              >
                Save
              </button>
            </div>
          </div>

          <h3 className="create-session-header">
            { CREATE_QUESTIONS_HEADER }
          </h3>
          <div className="create-questions-container">
            <div className="default-questions-box">
              <div id="default-questions-header">
                { DEFAULT_QUESTIONS_HEADER }
              </div>
              <div className="default-questions">
                <input
                  ref={ ref => this.startStopContinue = ref }
                  type="checkbox"
                  onChange={ () => this.addDefaultQuestion(START_STOP_CONTINUE_Q) }
                  id={ START_STOP_CONTINUE_Q }
                  value={ START_STOP_CONTINUE_Q }/>
                <label
                  title={ CAN_TOGGLE_TITLE }
                  htmlFor={ START_STOP_CONTINUE_Q }>
                  { START_STOP_CONTINUE_LABEL }
                </label>
                <input
                  ref={ ref => this.emf = ref }
                  type="checkbox"
                  onChange={ () => this.addDefaultQuestion(EXCEED_MEET_BELOW_Q) }
                  id={ EXCEED_MEET_BELOW_Q }
                  value={ EXCEED_MEET_BELOW_Q }/>
                <label
                  title={ CAN_TOGGLE_TITLE }
                  htmlFor={ EXCEED_MEET_BELOW_Q }>
                  { EMF_QUESTION_LABEL }
                </label>
              </div>
            </div>

            <div>

              { this.renderQuestions() }
              <input
                ref={(ref) => this.questioninput = ref }
                placeholder="add a question"/>
              <button
                onClick={ () => {
                  const question = this.questioninput.value;
                  if (question !== "") {
                    this.questioninput.value = "";
                    this.saveQuestion(question, OPEN_Q);
                  }
                }}
              >
                Save
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    currentSessionDeadline,
    questions,
    peers,
    sessionPeers,
    sessionReviewees,
  } = state;

  return {
    sessionReviewees,
    currentSessionDeadline,
    sessionPeers,
    questions,
    peers,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSessionName: name => dispatch(setSessionName(name)),
    removeQuestion: qId => dispatch(removeQuestion(qId)),
    removePeer: peerId => dispatch(removePeer(peerId)),
    addQuestions: qs => dispatch(addQuestions(qs)),
    updateSessionPeers: peers => dispatch(updateSessionPeers(peers)),
    updateSessionDeadline: deadline => dispatch(updateSessionDeadline(deadline)),
    addSessionReviewee: (reviewee, reviewerEmail) => dispatch(addSessionReviewee(reviewee, reviewerEmail)),
    removeSessionReviewee: (emailToRemove, reviewerEmail) => dispatch(removeSessionReviewee(emailToRemove, reviewerEmail)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateReviewSession)
