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
  DATEPICKER_PLACEHOLDER,
  NAME_SESSION_LABEL,
} from '../constants.js';
import MUIBaseTheme from './MUIBaseTheme.jsx';
import DebouncedInput from './DebouncedInput.jsx';


class CreateReviewSession extends MUIBaseTheme {
  constructor() {
    super();

    this.peerinput = null;
    this.questioninput = null;
    this.sessionName = null;
    this.saveQuestion = this.saveQuestion.bind(this);
    this.addPeer = this.addPeer.bind(this);
  }

  componentDidMount() {
    //TODO don't get peers on start
    //create input for adding reviewers,
    // use sessionPeers for added reviewer objects
    //be able to submit these reviewers
    //BE: create new session with these reviewers
    //reviewers are Reviewer instances
    //their User objects will be created and their Reviewer instances will be updated
    //when the Reviewer first logs in

//    const {
//      userId,
//      updateAvailablePeers,
//      peers,
//    } = this.props;
//
//    if (!peers.length) {
//      $.ajax({
//        url: `routes/peers/all/${userId}`,
//        success: peers => {
//          updateAvailablePeers(peers)
//        },
//        error: e => {
//          console.error(e);
//        }
//      });
//    }
  }

  saveQuestion() {
    const {
      addQuestions,
    }= this.props;

    const question = this.questioninput.value;
    this.questioninput.value = "";

    addQuestions([{
      content: question,
      id: Math.random(),
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

  render() {
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


          <h2 className="create-session-header">create questions</h2>
          <div className="create-questions-container">
            <div>{ this.renderQuestions() }</div>
            <input
              ref={(ref) => this.questioninput = ref }
              placeholder="add a question"/>
            <button
              onClick={ this.saveQuestion }
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
