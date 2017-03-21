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
} from '../actions.js';
import {
  DATEPICKER_PLACEHOLDER,
} from '../constants.js';
import MUIBaseTheme from './MUIBaseTheme.jsx';


class CreateReviewSession extends MUIBaseTheme {
  constructor() {
    super();
    this.questioninput = null;
    this.saveQuestion = this.saveQuestion.bind(this);
  }

  componentDidMount() {
    const {
      userId,
      updateAvailablePeers,
      peers,
    } = this.props;

    if (!peers.length) {
      $.ajax({
        url: `routes/peers/all/${userId}`,
        success: peers => {
          updateAvailablePeers(peers)
        },
        error: e => {
          console.error(e);
        }
      });
    }
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

  addPeer(selectedPeer) {
    const {
      updateSessionPeers,
    }= this.props;

    updateSessionPeers([selectedPeer]);
  }

  renderPeers() {
    const {
      removePeer,
      peers,
      sessionPeers,
    } = this.props;

    return peers.map(p => {
        const isInSession = !!sessionPeers.find(sp => sp.id === p.id);
        const inSessionClass = isInSession ? " in-session" : "";
        return (
          <li
            className={ `peer-to-pick${inSessionClass}` }
            key={ p.id }
            onClick={
              isInSession ?
              () => removePeer(p.id) :
              () => this.addPeer(p)
            }>
              { p.name }
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
      <li
        onClick={ () => removeQuestion(q.id) }
        title="click to remove"
        key={ i } >
        { q.content }
      </li>
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

    return (
      <div>
        <div>
          <h2 className="create-session-header">{ DATEPICKER_PLACEHOLDER }</h2>
          <div>{ this.renderDeadline() }</div>
          <h2 className="create-session-header">pick peers</h2>
          <ul>{ this.renderPeers() }</ul>
          <h2 className="create-session-header">create questions</h2>
          <div className="create-questions-container">
            <ol>{ this.renderQuestions() }</ol>
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
