import React, { PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import DatePicker from 'material-ui/DatePicker';
import {
  removePeer,
  addQuestions,
  updateSessionPeers,
  updateSessionDeadline,
  updateAvailablePeers,
  removeQuestion,
  setSessionName,
} from '../actions.js';
import {
  START_STOP_CONTINUE_LABEL,
  DATEPICKER_PLACEHOLDER,
  EMF_QUESTION_LABEL,
  NAME_SESSION_LABEL,
} from '../constants.js';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import DebouncedInput from './DebouncedInput.jsx';


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

  addPeer() {
    const {
      updateSessionPeers,
    }= this.props;

    const peerEmail = this.peerinput.value;
    const reviewer = {
      email: peerEmail,
      reviewSessionId: "",
      userId: "",
    };

    updateSessionPeers(reviewer);
  }

  renderPeers() {
    const {
      removePeer,
      sessionPeers,
    } = this.props;

    return sessionPeers.map((p, i) => {
        return (
          <li
            className="peer-to-pick in-session"
            key={ p.email }
            onClick={ () => removePeer(p.email) }>
              { p.email }
          </li>
        );
      }
    );
  }

  renderQuestions() {
    const {
      questions,
      removeQuestion,
    } = this.props;

    return questions.map((q, i) => (
      <div
        className="create-session questions"
        onClick={ () => {
          if (q.questionType !== "emf" && q.questionType !== "scc") {
            removeQuestion(q.id)
          }
        }}
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
    const inputRef = type === "scc" ? this.startStopContinue : this.emf;
    const question = type === "scc" ? START_STOP_CONTINUE_LABEL : EMF_QUESTION_LABEL;

    if (inputRef.checked) {
      this.saveQuestion(question, type, type);
    }
    else {
      removeQuestion(type);
    }

  }

  render() {
    const c = this;
    const {
      setSessionName,
    } = this.props;

    return (
      <div>
        <div>
          <h2 className="create-session-header">{ NAME_SESSION_LABEL }</h2>
          <div className="centered-input">
            <DebouncedInput
              className="answer-input"
              boundFunction={ setSessionName }
              activeClass="active"
              placeholder="name your session"
            />
          </div>
          <h2 className="create-session-header">{ DATEPICKER_PLACEHOLDER }</h2>
          <div>{ this.renderDeadline() }</div>
          <h2 className="create-session-header">pick peers</h2>

          <ul>{ this.renderPeers() }</ul>

           <input
             ref={(ref) => this.peerinput = ref }
             placeholder="type a peer's email"/>
           <button
             onClick={ this.addPeer }
           >
             Save
           </button>


          <h2 className="create-session-header">
            create questions (optional)
          </h2>
          <div className="create-questions-container">
            Default Questions to Include:
            <input
              ref={ ref => this.startStopContinue = ref }
              type="checkbox"
              onChange={ () => this.addDefaultQuestion("scc") }
              value="ssc"/>

              <label htmlFor="ssc">{ START_STOP_CONTINUE_LABEL }</label>

            <input
              ref={ ref => this.emf = ref }
              type="checkbox"
              onChange={ () => this.addDefaultQuestion("emf") }
              value="emf"/>

              <label htmlFor="emf">{ EMF_QUESTION_LABEL }</label>

            <div>
              { this.renderQuestions() }
            </div>
            <input
              ref={(ref) => this.questioninput = ref }
              placeholder="add a question"/>
            <button
              onClick={ () => {
                const question = this.questioninput.value;
                if (question !== "") {
                  this.questioninput.value = "";
                  this.saveQuestion(question, "open");
                }
              }}
            >
              Save
            </button>
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
    userId,
    sessionPeers,
  } = state;

  return {
    currentSessionDeadline,
    sessionPeers,
    questions,
    peers,
    userId,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSessionName: name => dispatch(setSessionName(name)),
    removeQuestion: qId => dispatch(removeQuestion(qId)),
    removePeer: peerId => dispatch(removePeer(peerId)),
    updateAvailablePeers: peers => dispatch(updateAvailablePeers(peers)),
    addQuestions: qs => dispatch(addQuestions(qs)),
    updateSessionPeers: peers => dispatch(updateSessionPeers(peers)),
    updateSessionDeadline: deadline => dispatch(updateSessionDeadline(deadline)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateReviewSession)
