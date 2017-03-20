import {
  SET_REVIEWER,
  SUBMIT_ANSWERS,
  SET_QS_SUBVIEW,
  UPDATE_AVAILABLE_PEERS,
  SET_SESSION_SUB_VIEW,
  REPLACE_QUESTIONS,
  UPDATE_PEERS_IN_SESSION,
  UPDATE_USERID,
  REPLACE_ANSWERS,
  ADD_QUESTIONS,
  ADD_ANSWER,
  UPDATE_SESSION_DEADLINE,
  SWITCH_MAIN_VIEW,
  SET_CURRENT_SESSION,
  REMOVE_PEER_FROM_SESSION,
  REMOVE_QUESTION,
  SUBMIT_NEW_SESSION,
  SET_AVAILABLE_SESSIONS,
} from './actions.js';
import {
  CREATE_SESSION_VIEW,
  PICK_SESSION_VIEW,
} from './constants.js'
import {
  getUserId,
} from './util.js';


const initialState = {
  userId: getUserId(), //TODO workaround
  reviewerId: "",
  reviewedId: "",
  peers: [],
  sessionPeers: [],
  sessions: [],
  currentSessionDeadline: new Date(),
  currentSessionId: "",
  questions: [],
  answers: [],
  mainView: CREATE_SESSION_VIEW, //enum, VIEW_ANSWERS_VIEW, CREATE_SESSION_VIEW, ANSWER_QUESTIONS_VIEW
  sessionView: PICK_SESSION_VIEW, //enum
};


export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REVIEWER:
      return Object.assign({}, state, {
        reviewerId: action.data.reviewerId,
        peers: action.data.reviewedUsers,
        sessionView: action.data.view,
      });

    case SUBMIT_ANSWERS:
      return Object.assign({}, state, {
        reviewedId: "",
        sessionView: PICK_PEER_TO_REVIEW_VIEW,
        answers: [],
      });

    case SET_QS_SUBVIEW:
      return Object.assign({}, state, {
        sessionView: action.data.questionType,
        questions: action.data.questions,
        reviewedId: action.data.peerId,
        answers: action.data.answers,
      });

    case SET_AVAILABLE_SESSIONS:
      return Object.assign({}, state, {
        sessionView: action.data.subView,
        sessions: action.data.sessions,
        reviewedId: action.data.reviewedId,
        reviewerId: action.data.reviewerId,
        peers: action.data.peers,
      });

    case SUBMIT_NEW_SESSION:
      return Object.assign({}, state, {
        questions: [],
        sessionPeers: [],
        currentSessionDeadline: new Date(),
      });

    case REMOVE_QUESTION:
      return Object.assign({}, state, {
        questions: state.questions.filter(q => q.id !== action.data),
      });

    case UPDATE_AVAILABLE_PEERS:
      return Object.assign({}, state, {
        peers: action.data.concat(state.peers),
      });

    case SET_SESSION_SUB_VIEW:
      return Object.assign({}, state, {
        sessionView: action.data,
      });

    case SET_CURRENT_SESSION:
      return Object.assign({}, state, {
        peers: action.data.reviewers,
        currentSessionId: action.data.id,
        sessionView: action.data.view,
      });

    case SWITCH_MAIN_VIEW:
      return Object.assign({}, state, {
        mainView: action.data,
        peers: [],
        reviewerId: "",
        reviewedId: "",
        questions: [],
        answers: [],
        sessionView: PICK_SESSION_VIEW,
      });

    case UPDATE_SESSION_DEADLINE:
      return Object.assign({}, state, {
        currentSessionDeadline: action.data,
      });

    case ADD_ANSWER:
      return Object.assign({}, state, {
        answers: state.answers.find(a => a.questionId === action.data.questionId) ?
          state.answers.map(a => a.questionId === action.data.questionId ? action.data : a) :
          [action.data].concat(state.answers),
      });

    case ADD_QUESTIONS:
      return Object.assign({}, state, {
        questions: state.questions.concat(action.data),
      });

    case REPLACE_ANSWERS:
      return Object.assign({}, state, {
        answers: action.data,
      });

    case REPLACE_QUESTIONS:
      return Object.assign({}, state, {
        questions: action.data,
      });

    case UPDATE_USERID:
      return Object.assign({}, state, {
        userId: action.data,
      });

    case REMOVE_PEER_FROM_SESSION:
      return Object.assign({}, state, {
        sessionPeers: state.sessionPeers.filter(sp => sp.id !==  action.data),
      });

    case UPDATE_PEERS_IN_SESSION:
      return Object.assign({}, state, {
        sessionPeers: action.data.concat(state.sessionPeers), //TODO no duplicate peers
      });

    default:
      return state;
  }
}
