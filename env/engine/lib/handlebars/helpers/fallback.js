module.exports = function (value, fallback) {
  const isAsync = typeof arguments[arguments.length - 1] === 'function';
  value = value || fallback;
  if (isAsync) {
    arguments[arguments.length - 1](null, value);
  } else {
    return value;
  }
};
