import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  setSessionSubView,
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
    setSessionSubView: view => dispatch(setSessionSubView(view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewSessions)
