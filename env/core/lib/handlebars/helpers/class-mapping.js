/* eslint-disable complexity */

const co = require('co');

module.exports = engine =>
    async function(value, context, cb) {
        const isAsync = typeof arguments[arguments.length - 1] === 'function';
        const classes = [];

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
                classes.push(value);
            }
        }

        Object.assign(hash, context.hash);

        for (const name in hash) {
            let condition;
            if (typeof hash[name] === 'string' && engine.asyncHelpers.hasAsyncId(hash[name])) {
                condition = await co(engine.asyncHelpers.resolveId(hash[name]));
            } else {
                condition = hash[name];
            }
            if (condition) {
                classes.push(name);
            }
        }
        if (cb) {
            return cb(null, classes.join(' '));
        } else {
            return classes.join(' ');
        }
    };
