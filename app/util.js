import {
  USER_ID_CAPTURE,
} from './constants.js'


export function getUserId() {
  const matches = window.location.href.match(USER_ID_CAPTURE);

  if (matches) {
    return matches[1];
  }
  return "";
}
