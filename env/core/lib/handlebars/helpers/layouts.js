const hasOwn = Object.prototype.hasOwnProperty;

const co = require('co');
const merge = require('extend-shallow');

function noop () {
    return '';
}

function getStack (context) {
    return context.$$layoutStack;
}

function applyStack (context, engine) {
    const stack = getStack(context);

    const results = [];
    while (stack && stack.length) {
        (engine.asyncHelpers.matches(stack.shift()(context)) || []).forEach(function (id) {
            if (engine.asyncHelpers.hasAsyncId(id)) {
                // eslint-disable-next-line no-useless-escape
                results.push(co(engine.asyncHelpers.resolveId(id.match(/({\$[^\{\}]+\$})/, '{$1}')[0])));
            }
        });
    }
    return Promise.all(results);
}

function getActions (context) {
    return context.$$layoutActions = context.$$layoutActions || [];
}

function getActionsByName (context, name) {
    var actions = getActions(context);

    return actions[name] || (actions[name] = []);
}

function applyAction (val, action) {
    const context = this;

    function fn () {
        return action.fn(context, action.options);
    }

    switch (action.mode) {
        case 'append': {
            return val + fn();
        }

        case 'prepend': {
            return fn() + val;
        }

        case 'replace': {
            return fn();
        }

        default: {
            return val;
        }
    }
}

function mixin (target) {
    let arg,
        key,
        len = arguments.length,
        i = 1;

    for (; i < len; i++) {
        arg = arguments[i];

        if (!arg) {
            continue;
        }

        for (key in arg) {
            // istanbul ignore else
            if (hasOwn.call(arg, key)) {
                target[key] = arg[key];
            }
        }
    }

    return target;
}

/**
 * Generates an object of layout helpers.
 *
 * @type {Function}
 * @param {Object} handlebars Handlebars instance.
 * @return {Object} Object of helpers.
 */
function layouts (engine) {
    const handlebars = engine.Handlebars;

    const helpers = {
        /**
         * @method extend
         * @param {String} name
         * @param {?Object} customContext
         * @param {Object} options
         * @param {Function(Object)} options.fn
         * @param {Object} options.hash
         * @return {String} Rendered partial.
         */
        extend: function (name, customContext, options, cb) {
            // Make `customContext` optional
            if (arguments.length < 4) {
                cb = options;
                options = customContext;
                customContext = null;
            }

            options = options || {};

            let fn = options.fn || noop,
                context = mixin({}, customContext, options.hash, {
                    $$layoutActions: [],
                    $$layoutStack: []
                }),
                data = handlebars.createFrame(options.data),
                template = handlebars.partials[name];

            // Partial template required
            if (template == null) {
                throw new Error(`Missing partial: ${name}`);
            }

            // Compile partial, if needed
            if (typeof template !== 'function') {
                template = handlebars.compile(template);
            }

            // Add overrides to stack
            getStack(context).push(fn);

            // Render partial
            cb(
                null,
                template(context, {
                    data: data
                })
            );
        },

        /**
         * @method embed
         * @param {String} name
         * @param {?Object} customContext
         * @param {Object} options
         * @param {Function(Object)} options.fn
         * @param {Object} options.hash
         * @return {String} Rendered partial.
         */
        embed: function () {
            const context = mixin({}, this || {});

            // Reset context
            context.$$layoutStack = null;
            context.$$layoutActions = null;

            // Extend
            return helpers.extend.apply(context, arguments);
        },

        /**
         * @method block
         * @param {String} name
         * @param {Object} options
         * @param {Function(Object)} options.fn
         * @return {String} Modified block content.
         */
        block: function (name, options, cb) {
            options = options || {};

            let fn = options.fn || noop,
                data = handlebars.createFrame(options.data),
                context = this || {};

            return applyStack(context, engine).then(
                function (stack) {
                    stack.forEach(function (d) {
                        context.$$layoutActions = Object.assign(context.$$layoutActions || {}, d.$$layoutActions);
                    });

                    const result = getActionsByName(context, name).reduce(
                        function (result, value) {
                            result = applyAction.bind(context._parent)(result, value);
                            return result;
                        },
                        fn(context, {
                            data: data,
                            context: context
                        })
                    );

                    cb(null, result);
                }.bind(this)
            );
        },

        /**
         * @method content
         * @param {String} name
         * @param {Object} options
         * @param {Function(Object)} options.fn
         * @param {Object} options.hash
         * @param {String} options.hash.mode
         * @return {String} Always empty.
         */
        content: function (name, options, cb) {
            options = options || {};

            let fn = options.fn,
                data = handlebars.createFrame(options.data),
                hash = options.hash || {},
                mode = hash.mode || 'replace',
                context = this || {};

            return applyStack(context, engine).then(
                function () {
                    // Getter
                    if (!fn) {
                        cb(null, name in getActions(context));
                        return;
                    }

                    // Setter

                    getActionsByName(context, name).push({
                        options: {
                            data: data
                        },
                        mode: mode.toLowerCase(),
                        fn: fn
                    });
                    cb(null, context);
                }.bind(this)
            );
        },

        mixin: function (name) {
            let context,
                cb = arguments[3],
                options = arguments[2];

            if (typeof arguments[2] === 'function') {
                options = arguments[1];
                cb = arguments[2];
            } else if (arguments[2]) {
                context = arguments[1];
            }
            context = context || options.data.root;

            if (typeof name !== 'string') {
                cb(null, '');
                return;
            }
            let ctx = {};
            const localContext = this.app.views.partials[name].context();

            if (localContext) {
                ctx = merge(ctx, localContext.data || localContext, getContextData(context));
            }
            ctx.relativeToRoot = options.data.root.relativeToRoot;

            this.app.getAsyncHelper('extend').bind(this)(name, ctx, options, cb);
        }
    };

    return helpers;
}

function getContextData (context) {
    if (context) {
        if (context.data) {
            if (context.data.root) {
                return context.data.root;
            } else {
                return context.data;
            }
        } else {
            return context;
        }
    } else {
        return {};
    }
}

/**
 * Registers layout helpers on a Handlebars instance.
 *
 * @method register
 * @param {Object} handlebars Handlebars instance.
 * @return {Object} Object of helpers.
 * @static
 */
module.exports = layouts;
