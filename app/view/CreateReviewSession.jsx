import React, { PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import {
  addQuestions,
  updateSessionPeers,
  updateSessionDeadline,
  updateAvailablePeers,
} from '../actions.js';
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
    } = this.props;

    $.ajax({
      url: 'routes/peers/all/$userId',
      success: peers => {
        console.log('success');
        updateAvailablePeers(peers)
      },
      error: e => {
        console.error(e);
      }
    });
  }

  saveQuestion() {
    const {
      addQuestions,
    }= this.props;

    const question = this.questioninput.value;
    this.questioninput.value = "";

    addQuestions([question]);
  }

  addPeer(selectedPeer) {
    const {
      updateSessionPeers,
    }= this.props;

    updateSessionPeers([selectedPeer]);
  }

  render() {
    const {
      peers,
      questions,
    } = this.props;

    return (
      <div>
        <div>
          <div>peers</div>
          <div>{ peers.map(p => <div key={ p.id } onClick={ () => this.addPeer(p) }>{ p.name }</div>) }</div>
        </div>
        <div>
            <div>questions</div>
            <div>
              { questions.map((q, i) => <div key={ i } >{ q }</div>) }
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
    questions,
    peers,
    userId,
    sessionPeers,
  } = state;

  return {
    sessionPeers,
    questions,
    peers,
    userId,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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
