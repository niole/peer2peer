import {
  REMOVE_SESSION_REVIEWEE,
  ADD_SESSION_REVIEWEE,
  SET_SESSION_NAME,
  SET_REVIEWER,
  SUBMIT_ANSWERS,
  SET_QS_SUBVIEW,
  UPDATE_AVAILABLE_PEERS,
  SET_SESSION_SUB_VIEW,
  REPLACE_QUESTIONS,
  UPDATE_PEERS_IN_SESSION,
  UPDATE_USER,
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
  PICK_PEER_TO_REVIEW_VIEW,
  CREATE_SESSION_VIEW,
  PICK_SESSION_VIEW,
} from './constants.js'


const initialState = {
  user: {},
  isAdmin: false,
  isReviewer: false,
  reviewer: {},
  reviewed: [],
  reviewee: {},
  sessionReviewees: {}, //hashMap where keys are emails sessionPeers, values are reviewees
  sessionPeers: [],
  peers: [],
  userId: "",
  reviewedId: "",
  sessions: [],
  currentSessionDeadline: new Date(),
  currentSessionId: "",
  currentSession: {},
  currentSessionName: "",
  questions: [],
  answers: [],
  mainView: "", //enum, VIEW_ANSWERS_VIEW, CREATE_SESSION_VIEW, ANSWER_QUESTIONS_VIEW,
  sessionView: PICK_SESSION_VIEW, //enum
};


export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case REMOVE_SESSION_REVIEWEE:
      return Object.assign({}, state, {
        sessionReviewees: [action.data.reviewerEmail].reduce((reviewees, reviewerEmail) => {
          reviewees[reviewerEmail] = reviewees[reviewerEmail].filter(r => r.email !== action.data.emailToRemove);
          return reviewees;
        }, Object.assign({}, state.sessionReviewees)),
      });

    case ADD_SESSION_REVIEWEE:
      return Object.assign({}, state, {
        sessionReviewees: [action.data.reviewerEmail].reduce((newReviewees, reviewerEmail) => {
          if (newReviewees[reviewerEmail]) {
            newReviewees[reviewerEmail].push(action.data.reviewee);
          }
          else {
            newReviewees[reviewerEmail] = [action.data.reviewee];
          }
          return newReviewees;
        }, Object.assign({}, state.sessionReviewees)),
      });

    case SET_SESSION_NAME:
      return Object.assign({}, state, {
        currentSessionName: action.data,
      });

    case SET_REVIEWER:
      return Object.assign({}, state, {
        reviewer: action.data.reviewer,
        peers: action.data.reviewedUsers,
        sessionView: action.data.view,
      });

    case SUBMIT_ANSWERS:
      return Object.assign({}, state, {
        reviewer: state.user,
        reviewedId: "",
        sessionView: PICK_PEER_TO_REVIEW_VIEW,
        answers: [],
        reviewed: state.reviewed.find(r => r.id.toString() === action.data.reviewed.id.toString()) ?
          state.reviewed.map(r => r.id.toString() === action.data.reviewed.id.toString() ? action.data.reviewed : r) :
          state.reviewed.concat([action.data.reviewed]),
      });

    case SET_QS_SUBVIEW:
      return Object.assign({}, state, {
        sessionView: action.data.questionType,
        questions: action.data.questions,
        reviewedId: action.data.peerId,
        answers: action.data.answers,
      },
        action.data.target
      );

    case SET_AVAILABLE_SESSIONS:
      return Object.assign({}, state, {
        sessionView: PICK_SESSION_VIEW,
        sessions: action.data.sessions,
        reviewedId: "",
        peers: [],
      });

    case SUBMIT_NEW_SESSION:
      return Object.assign({}, state, {
        questions: [],
        sessionPeers: [],
        currentSessionDeadline: new Date(),
        sessionReviewees: {},
        isReviewer: action.data.reviewer,
        isAdmin: action.data.admin,
      });

    case REMOVE_QUESTION:
      return Object.assign({}, state, {
        questions: state.questions.filter(q => q.id !== action.data),
      });

    case SET_SESSION_SUB_VIEW:
      return Object.assign({}, state, {
        reviewed: [],
        sessionView: action.data,
        reviewer: {},
        reviewee: {},
      });

    case SET_CURRENT_SESSION:
      return Object.assign({}, state, {
        reviewer: {},
        reviewee: {},
        currentSession: action.data.session,
        reviewed: action.data.reviewed,
        peers: action.data.reviewers,
        currentSessionId: action.data.id,
        sessionView: action.data.view,
      });

    case SWITCH_MAIN_VIEW:
      return Object.assign({}, state, {
        reviewer: {},
        reviewee: {},
        reviewed: [],
        mainView: action.data,
        peers: [],
        reviewedId: "",
        questions: [],
        answers: [],
        sessionView: PICK_SESSION_VIEW,
        sessions: [],
        currentSession: {},
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

    case UPDATE_USER:
      return Object.assign({}, state, {
        userId: action.data.user.id.toString(),
        user: action.data.user,
        isAdmin: action.data.user.admin,
        isReviewer: action.data.user.reviewer,
        mainView: action.data.view || state.mainView,
      });

    case REMOVE_PEER_FROM_SESSION:
      return Object.assign({}, state, {
        sessionPeers: state.sessionPeers.filter(sp => sp.email !==  action.data),
        sessionReviewees: Object.keys(state.sessionReviewees).reduce((sessionReviewees, reviewerEmail) => {
          if (reviewerEmail === action.data) {
            delete sessionReviewees[reviewerEmail];
          }
          else {
            sessionReviewees[reviewerEmail] = sessionReviewees[reviewerEmail].filter(sr => sr.email !== action.data);
          }
          return sessionReviewees;
          }, Object.assign({}, state.sessionReviewees)),
      });

    case UPDATE_PEERS_IN_SESSION:
      if (state.sessionPeers.find(p => p.email === action.data.email)) {
        return state;
      }
      return Object.assign({}, state, {
        sessionPeers: [action.data].concat(state.sessionPeers),
        sessionReviewees: [action.data].reduce((sessionReviewees, nextPeer) => {
            sessionReviewees[nextPeer.email] = [];
            return sessionReviewees;
          }, Object.assign({}, state.sessionReviewees)),
      });


    default:
      return state;
  }
}
