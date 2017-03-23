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

export function debouncer(F, context = null, delay = 200) {
  let id;
  return function debounced() {
    clearTimeout(id);
    id = setTimeout(() => F.apply(context, arguments), delay);
  };
}
