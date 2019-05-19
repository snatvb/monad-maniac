
export function curry1<T, U>(op: (a: T) => U, a?: T) {
  return a !== undefined ? op(a) : op;
}

/**
 * function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
 */
