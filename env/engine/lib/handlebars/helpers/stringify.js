module.exports = function (value) {
  const isAsync = typeof arguments[arguments.length - 1] === 'function';
  value = JSON.stringify(value);
  if (isAsync) {
    arguments[arguments.length - 1](null, value);
  } else {
    return value;
  }
};
