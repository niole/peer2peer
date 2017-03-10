export const UPDATE_PEERS_IN_SESSION = "updatePeersInSession";
export const UPDATE_USERID = "updateuserId";
export const REPLACE_QUESTIONS = "replaceQuestions";
export const REPLACE_ANSWERS = "replaceAnswers";
export const ADD_QUESTIONS = "addQuestions";
export const ADD_ANSWERS = "addAnswers";
export const UPDATE_SESSION_DEADLINE = "updateSessionDeadline";
export const SWITCH_MAIN_VIEW = "switchMainView";
export const SET_EDITING = "setEditing";
export const SET_SESSION_INDEX = "setSessionIndex";
export const SET_ALL_PEERS = "setAllPeers";


export function setAllPeers(isAllPeers) {
  return {
    type: SET_ALL_PEERS,
    data: isAllPeers,
  };
}

export function setEditing(nextIndex) {
  return {
    type: SET_SESSION_INDEX,
    data: nextIndex,
  };
}

export function setEditing(isEditing) {
  return {
    type: SET_EDITING,
    data: isEditing,
  };
}

export function switchMainView(view) {
  return {
    type: SWITCH_MAIN_VIEW,
    data: view,
  };
}

export function updateSessionDeadline(newDeadLine) {
  return {
    type: UPDATE_SESSION_DEADLINE,
    data: newDeadline,
  };
}

export function addAnswers(answers) {
  return {
    type: ADD_ANSWERS,
    data: answers,
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

export function updateSessionPeers(peers, sessionId) {
  return {
    type: UPDATE_PEERS_IN_SESSION,
    data: {
      peers,
      sessionId,
    }
  };
}
