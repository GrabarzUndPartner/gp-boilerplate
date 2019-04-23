const assemble = require('assemble')();
const path = require('upath');
const merge = require('mixin-deep');
let engine = require('engine-handlebars');

// Creates an isolated Handlebars environment.
engine.Handlebars = engine.Handlebars.create();
assemble.engine('.hbs', engine);
engine = assemble.getEngine('.hbs');

/**
 * Template Helper
 */
const templateHelpers = require('template-helpers')();
const handelbarsHelpers = require('assemble-handlebars-helpers');
const layoutsHelpers = require('../handlebars/helpers/layouts')(engine);
const rawHelper = require('../handlebars/helpers/raw');
const concatHelper = require('../handlebars/helpers/concat');
const classMappingHelper = require('../handlebars/helpers/class-mapping');
const dataAttributesHelper = require('../handlebars/helpers/data-attributes');

assemble.helpers(templateHelpers);
assemble.asyncHelpers(layoutsHelpers);
assemble.asyncHelper('raw', rawHelper);
assemble.helper('concat', concatHelper);
assemble.helper('class-mapping', classMappingHelper(engine));
assemble.helper('data-attrs', dataAttributesHelper(engine));
assemble.helpers(handelbarsHelpers);

/**
 * Renames
 */
assemble.option('renameKey', function(filename, content, options) {
    if (path.extname(filename) === '.json') {
        return options.namespace(filename, options);
    }
    return filename;
});

assemble.partials.option('renameKey', function(fp, view) {
    if (view.isView) {
        return path.relative(view.base, fp).replace(path.extname(fp), '');
    }
    return fp;
});

assemble.layouts.option('renameKey', function(fp, view) {
    // Pfad anpassen wenn call eine View und kein File ist.
    if (view.isView) {
        return path.relative(view.base, fp).replace(path.extname(fp), '');
    }
    return fp;
});

assemble.preRender(/\.hbs$/, mergeContext(assemble));

function mergeContext(app, locals) {
    return function(view, next) {
        var key = view.relative.replace(path.extname(view.relative), '');
        view.layout = view.data.layout || view.layout;
        view.data = merge(
            {
                relativeToRoot: getRelativeToRoot(view),
                partial: key.replace('partials/', ''),
                env: process.env.NODE_ENV
            },
            locals,
            view.data.data || view.data,
            app.cache.data[key] || {}
        );
        next();
    };
}

function getRelativeToRoot(view) {
    var relativeToRoot = path.relative(path.dirname(view.key), view.base).replace(path.extname(view.key), '') || '.';
    if (relativeToRoot !== '') {
        return relativeToRoot + '/';
    } else {
        return './';
    }
}

module.exports = assemble;
