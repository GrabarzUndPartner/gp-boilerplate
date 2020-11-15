/* eslint-disable complexity */

const co = require('co');

module.exports = engine =>
  async function (value, context, cb) {
    const isAsync = typeof arguments[arguments.length - 1] === 'function';
    const attributes = [];

    let hash = {};

    // {{{class-mapping foo=true}}}
    if (arguments.length < 2 || (isAsync && arguments.length < 3)) {
      cb = context;
      context = value;
      value = null;
    } else {
      // {{{class-mapping class foo=true}}}
    }
    if (value) {
      if (value && typeof value === 'object') {
        hash = Object.assign(value, hash);
      } else {
        attributes.push(value);
      }
    }

    Object.assign(hash, context.hash);

    for (let name in hash) {
      value = null;
      if (typeof hash[name] === 'string' && engine.asyncHelpers.hasAsyncId(hash[name])) {
        value = await co(engine.asyncHelpers.resolveId(hash[name]));
      } else {
        value = hash[name];
      }
      name = toSnakeCase(name, '-');
      if (value) {
        attributes.push(`data-${name}="${value}"`);
      } else {
        attributes.push(`data-${name}"`);
      }
    }
    if (cb) {
      return cb(null, attributes.join(' '));
    } else {
      return attributes.join(' ');
    }
  };

function toSnakeCase (text, sep = '_') {
  const result = text.replace(/([A-Z])/g, `${sep}$1`);
  return result.toLowerCase();
}
