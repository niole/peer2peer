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
    this.deadline = null;
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
          console.log('success');
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
        return (
          <li
            style={{ color: isInSession ? "green" : "black" }}
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
      <DatePicker
        onChange={ (other, date) => updateSessionDeadline(date) }
        ref={ ref => this.deadline = ref }
        defaultDate={ currentSessionDeadline }
        hintText={ DATEPICKER_PLACEHOLDER }
        container="inline"
        mode="landscape"/>
    );
  }

  render() {

    return (
      <div>
        <div>
          <div>{ DATEPICKER_PLACEHOLDER }</div>
          <div>{ this.renderDeadline() }</div>
          <div>peers</div>
          <ul>{ this.renderPeers() }</ul>
        </div>
        <div>
            <div>questions</div>
            <div>
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
