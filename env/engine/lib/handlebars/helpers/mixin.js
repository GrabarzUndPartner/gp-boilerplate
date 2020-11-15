const merge = require('extend-shallow');

module.exports = function (engine, assemble) {
  if (require('handlebars-layouts')(engine) !== engine.helpers.extend) {
    engine.registerHelper(require('handlebars-layouts')(engine));
  }

  return function (name) {
    const options = arguments[2] || arguments[1];
    let context = {};
    if (arguments[2]) {
      context = arguments[1];
    }

    if (typeof name !== 'string') {
      return '';
    }
    let ctx = {};
    const localContext = assemble.views.partials[name].context();

    if (localContext) {
      ctx = merge(ctx, localContext.data || localContext, getContextData(context));
    }
    ctx.relativeToRoot = options.data.root.relativeToRoot;
    return engine.helpers.extend(name, ctx, options);
  };
};

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
