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

/* review session views */
export const PICK_SESSION_VIEW = "pickSession";
export const PICK_PEER_TO_REVIEW_VIEW = "pickPeerToReviewView";
export const EDITABLE_QS_VIEW = "editQuestionsView";
export const READ_ONLY_QS_VIEW = "readOnlyQsView";
export const PICK_PEER_TO_READ_VIEW = "pickPeerAndReadTheirReviews";
export const READ_PEERS_REVIEWS_VIEW = "readPeersReviewsView";
export const USER_ID_CAPTURE = /\/([0-9]+)$/;

export const VIEW_TO_HEADER_MAP = {
  [VIEW_ANSWERS_VIEW]: VIEW_ONLY_QS_LABEL,
  [CREATE_SESSION_VIEW]: CREATE_SESSION_LABEL,
  [ANSWER_QUESTIONS_VIEW]: EDITABLE_QS_LABEL,
  [EDITABLE_QS_VIEW]: EDITABLE_QS_LABEL,
  [PICK_SESSION_VIEW]: PICK_SESSION_LABEL,
  [PICK_PEER_TO_REVIEW_VIEW]: PICK_PEER_LABEL,
  [PICK_PEER_TO_READ_VIEW]: READ_PEERS_REVIEWS_LABEL,
  [READ_PEERS_REVIEWS_VIEW]: VIEW_ONLY_QS_LABEL,
  [READ_ONLY_QS_VIEW]: VIEW_ONLY_QS_LABEL,
};

export const HEADER_TO_VIEW_MAP = {
  [EDITABLE_QS_LABEL]: EDITABLE_QS_VIEW,
  [PICK_SESSION_LABEL]: PICK_SESSION_VIEW,
  [PICK_PEER_LABEL]: PICK_PEER_TO_REVIEW_VIEW,
  [READ_PEERS_REVIEWS_LABEL]: PICK_PEER_TO_READ_VIEW,
  [VIEW_ONLY_QS_LABEL]: READ_PEERS_REVIEWS_VIEW,
  [VIEW_ONLY_QS_LABEL]: READ_ONLY_QS_VIEW,
};

