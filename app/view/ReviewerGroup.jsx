import React, { Component, PropTypes } from 'react';


const { arrayOf, shape, func, string } = PropTypes;
const propTypes = {
  peer: shape({
    email: string.isRequired,
  }).isRequired,
  addRevieweeHander: func.isRequired,
  removeReviewerHander: func.isRequired,
  removeRevieweeHandler: func.isRequired,
  reviewees: arrayOf(shape({ email: string.isRequired }).isRequired).isRequired,
  remainingPeers: arrayOf(shape({ email: string.isRequired }).isRequired).isRequired,
};

class ReviewerGroup extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
  }

  renderReviewees() {
    const {
      peer,
      reviewees,
      removeRevieweeHandler,
    } = this.props;

    return reviewees.map(r => (
      <div
        className="peer-to-pick"
        key={ `${r.email}-reviewee` }
        onClick={ () => removeRevieweeHandler(r.email, peer.email) }>
        { r.email }
      </div>
    ));
  }

  renderRemainingRevieweeDropDown() {
    const {
      peer,
      remainingPeers,
      addRevieweeHander,
    } = this.props;

    const dropDownContents = remainingPeers.map(r => (
      <div
        className="peer-to-pick"
        key={ `${r.email}-remaining` }
        onClick={ () => addRevieweeHander(r, peer.email) }>
        { r.email }
      </div>
    ));

    return (
      <div className="peer-dropdown">
        { dropDownContents }
      </div>
    );
  }

  renderAddRevieesButton(email, canShowDropDown) {
    return (
      <div
        onMouseEnter={ canShowDropDown ? () => this.setState({ show: !this.state.show }) : () => {} }
        className="hover-reviewee-button">
        pick reviewees for { email }
      </div>
    );
  }

  render() {
    const {
      reviewees,
      peer,
      removeReviewerHander,
      remainingPeers,
    } = this.props;
    const {
      show,
    } = this.state;
    const {
      email,
    } = peer;
    const canShowDropDown = !!remainingPeers.length;
    const canShowButton = canShowDropDown || !!reviewees.length;

    return (
      <div className="reviewer-group">
        <div
          className="peer-to-pick in-session"
          key={ email }
          onClick={ () => removeReviewerHander(email) }>
            { email }
        </div>
        { canShowButton &&
          this.renderAddRevieesButton(email, canShowDropDown) }
        { show && canShowDropDown && this.renderRemainingRevieweeDropDown() }
        { this.renderReviewees() }
      </div>
    );
  }
}

ReviewerGroup.propTypes = propTypes;
export default ReviewerGroup;
