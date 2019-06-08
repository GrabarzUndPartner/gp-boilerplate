module.exports = function () {
  const isAsync = typeof arguments[arguments.length - 1] === 'function';
  const str = Array.from(arguments)
    .slice(0, arguments.length - (1 + isAsync))
    .join('');
  if (isAsync) {
    arguments[arguments.length - 1](null, str);
  } else {
    return str;
  }
};
