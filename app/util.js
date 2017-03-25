export function debouncer(F, context = null, delay = 200) {
  let id;
  return function debounced() {
    clearTimeout(id);
    id = setTimeout(() => F.apply(context, arguments), delay);
  };
}
