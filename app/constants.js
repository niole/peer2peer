/* button labels */
export const CREATE_SESSION_BTN_LABEL = "Create Peer2Peer Session";

/* main view enum */
export const VIEW_ANSWERS_VIEW = "viewAnswersView";
export const CREATE_SESSION_VIEW = "createReviewSessionView";
export const ANSWER_QUESTIONS_VIEW = "answerQuestionsView";

/* header labels */
export const DATEPICKER_PLACEHOLDER = "set a deadline";
export const PICK_SESSION_LABEL = "Pick a Session";
export const PICK_PEER_TO_REVIEW_LABEL = "Pick Peer To Review";
export const PICK_PEER_LABEL = "Pick Peer";
export const EDITABLE_QS_LABEL = "Answer Questions";
export const VIEW_ONLY_QS_LABEL = "View Answers";
export const READ_PEERS_REVIEWS_LABEL = "Read Peer's Reviews";
export const CREATE_SESSION_LABEL = "Create a Review Session";
export const SUBMIT_ANSWERS_LABEL = "Submit Answers";
export const READ_REVIEWS_ABOUT_LABEL = "Read Reviews By";
export const REVIEW_SESSIONS_SUB_HEADER = "review sessions";
export const QUESTIONS_SUB_HEADER = "questions";
export const ANSWERS_SUB_HEADER = "answers";
export const REVIEW_DEADLINE_SUB_HEADER = "deadline";

/* review session views */
export const PICK_SESSION_VIEW = "pickSession";
export const PICK_PEER_TO_REVIEW_VIEW = "pickPeerToReviewView";
export const EDITABLE_QS_VIEW = "editQuestionsView";
export const READ_ONLY_QS_VIEW = "readOnlyQsView";
export const PICK_PEER_TO_READ_VIEW = "pickPeerAndReadTheirReviews";
export const READ_PEERS_REVIEWS_VIEW = "readPeersReviewsView";
export const USER_ID_CAPTURE = /\/([0-9]+)$/;

export const HEADER_TO_VIEW_MAP = {
  [PICK_SESSION_LABEL]: PICK_SESSION_VIEW,
  [PICK_PEER_LABEL]: PICK_PEER_TO_REVIEW_VIEW,
  [READ_PEERS_REVIEWS_LABEL]: PICK_PEER_TO_READ_VIEW,
  [READ_REVIEWS_ABOUT_LABEL]: READ_PEERS_REVIEWS_VIEW,
  [VIEW_ONLY_QS_LABEL]: READ_ONLY_QS_VIEW,
  [EDITABLE_QS_LABEL]: EDITABLE_QS_VIEW,
};

export const VIEW_TO_HEADER_MAP = (function() {
  let base = {
    [VIEW_ANSWERS_VIEW]: VIEW_ONLY_QS_LABEL,
    [CREATE_SESSION_VIEW]: CREATE_SESSION_LABEL,
    [ANSWER_QUESTIONS_VIEW]: EDITABLE_QS_LABEL,
  };

  let key;
  for (key in HEADER_TO_VIEW_MAP) {
    base[HEADER_TO_VIEW_MAP[key]] = key;
  }
  return base;
})();

export const REVISIT_SECTION_TITLE = "click to revisit this section";
export const REVIEW_PEERS_TITLE = "click to start reviewing your peers";
export const ANSWER_Q_PLACEHOLDER = "answer the question";
export const READ_PEERS_REVIEWS_TITLES = "click to read peer's completed reviews";
export const NOT_COMPLETED_REVIEW_HEADER = "This user has not completed this review";
export const NO_SESSIONS_TO_REVIEW_HEADER = "You have no sessions to review";
