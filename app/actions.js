import {
  PICK_SESSION_VIEW,
} from './constants.js';
export const UPDATE_PEERS_IN_SESSION = "updatePeersInSession";
export const UPDATE_USERID = "updateuserId";
export const REPLACE_QUESTIONS = "replaceQuestions";
export const REPLACE_ANSWERS = "replaceAnswers";
export const ADD_QUESTIONS = "addQuestions";
export const ADD_ANSWER = "addAnswer";
export const UPDATE_SESSION_DEADLINE = "updateSessionDeadline";
export const SWITCH_MAIN_VIEW = "switchMainView";
export const SET_CURRENT_SESSION = "setCurrentSession";
export const SET_SESSION_SUB_VIEW = "setSessionSubView";
export const UPDATE_AVAILABLE_PEERS = "updateAvailablePeers";
export const REMOVE_PEER_FROM_SESSION = "removePeerFromSession";
export const REMOVE_QUESTION = "removeQuestion";
export const SUBMIT_NEW_SESSION = "submitNewSession";
export const SET_AVAILABLE_SESSIONS = "setAvailableSessions";
export const SET_QS_SUBVIEW = "setQuestionsSubview";
export const SUBMIT_ANSWERS = "submitAnswers";
export const SET_REVIEWER = "setReviewer";
export const SET_SESSION_NAME = "setSessionName";


export function setSessionName(name) {
  return {
    type: SET_SESSION_NAME,
    data: name,
  };
}

export function setReviewer(reviewer, reviewedUsers, view) {
  return {
    type: SET_REVIEWER,
    data: {
      reviewer,
      reviewedUsers,
      view,
    },
  };
}

export function submitAnswers(reviewed) {
  return {
    type: SUBMIT_ANSWERS,
    data: {
      reviewed,
    },
  };
}

export function setQuestionSubview(questionType, qA, peerId) {
  return {
    type: SET_QS_SUBVIEW,
    data: {
      peerId,
      questionType,
      questions: qA.questions,
      answers: qA.answers || [],
    },
  };
}

export function setAvailableSessions(sessions, peers = [], reviewerId = "", reviewedId = "", subView = PICK_SESSION_VIEW) {
  return {
    type: SET_AVAILABLE_SESSIONS,
    data: {
      subView,
      sessions,
      reviewedId,
      reviewerId,
      peers,
    },
  };
}

export function submitNewSession() {
  return {
    type: SUBMIT_NEW_SESSION,
    data: null,
  };
}

export function removeQuestion(qId) {
  return {
    type: REMOVE_QUESTION,
    data: qId,
  };
}

export function removePeer(peerId) {
  return {
    type: REMOVE_PEER_FROM_SESSION,
    data: peerId,
  };
}

export function updateAvailablePeers(peers) {
  return {
    type: UPDATE_AVAILABLE_PEERS,
    data: peers,
  };
}

export function setSessionSubView(view) {
  return {
    type: SET_SESSION_SUB_VIEW,
    data: view
  };
}

export function setCurrentSession(id, session, data, view) {
  return {
    type: SET_CURRENT_SESSION,
    data: {
      id,
      session,
      reviewers: data.reviewers,
      reviewed: data.reviewed,
      view,
    }
  };
}

export function switchMainView(view) {
  return {
    type: SWITCH_MAIN_VIEW,
    data: view,
  };
}

export function updateSessionDeadline(newDeadline) {
  return {
    type: UPDATE_SESSION_DEADLINE,
    data: newDeadline,
  };
}

export function addAnswer(answer) {
  return {
    type: ADD_ANSWER,
    data: answer,
  };
}

export function addQuestions(qs) {
  return {
    type: ADD_QUESTIONS,
    data: qs,
  };
}

export function replaceAnswers(newAnswers) {
  return {
    type: REPLACE_ANSWERS,
    data: newAnswers,
  };
}

export function replaceQuestions(newQs) {
  return {
    type: REPLACE_QUESTIONS,
    data: newQs,
  };
}

export function updateUserId(userId) {
  return {
    type: UPDATE_USERID,
    data: userId,
  };
}

export function updateSessionPeers(peers) {
  return {
    type: UPDATE_PEERS_IN_SESSION,
    data: peers,
  };
}
