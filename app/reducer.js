import {
  SET_SESSION_SUB_VIEW,
  REPLACE_QUESTIONS,
  UPDATE_PEERS_IN_SESSION,
  UPDATE_USERID,
  REPLACE_ANSWERS,
  ADD_QUESTIONS,
  ADD_ANSWERS,
  UPDATE_SESSION_DEADLINE,
  SWITCH_MAIN_VIEW,
  SET_CURRENT_SESSION,
} from './actions.js';
import {
  CREATE_SESSION_VIEW,
  PICK_SESSION_VIEW,
} from './constants.js'


const initialState = {
  userId: "",
  reviewerId: "",
  peers: [],
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
    case SET_SESSION_SUB_VIEW:
      return Object.assign({}, state, {
        sessionView: action.data,
      });

    case SET_CURRENT_SESSION:
      return Object.assign({}, state, {
        currentSessionId: action.data.id,
        sessionView: action.data.view,
      });

    case SWITCH_MAIN_VIEW:
      return Object.assign({}, state, {
        mainView: action.data,
      });

    case UPDATE_SESSION_DEADLINE:
      return Object.assign({}, state, {
        currentSessionDeadline: action.data,
      });

    case ADD_ANSWERS:
      return Object.assign({}, state, {
        answers: action.data.concat(state.answers),
      });

    case ADD_QUESTIONS:
      return Object.assign({}, state, {
        questions: action.data.concat(state.questions),
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

    case UPDATE_PEERS_IN_SESSION:
      return Object.assign({}, state, {
        sessions: state.sessions.map(nextSession => {
          if (nextSession.id === action.data.sessionId) {
            nextSession.reviewers = nextSession.reviewers.concat(action.data.peers);
          }
          return nextSession;
        })
      });

    default:
      return state;
  }
}
