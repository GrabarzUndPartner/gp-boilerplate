const fs = require('fs');
// eslint-disable-next-line node/no-deprecated-api
require.extensions['.css'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const merge = require('mixin-deep');
const upath = require('upath');
const beautify = require('js-prettify');
const cssmin = require('cssmin');
const hljs = require('highlight.js');

hljs.configure({});

module.exports = function (assemble) {
  return function (options, cb) {
    const view = assemble.getView('partials', 'docs/detail');
    assemble.engine('.hbs').render(options.fn(), options.data.root, function (err, html) {
      if (err) {
        return cb(err);
      }

      let jsonContent = getJSONContent(assemble, options.data.root.partial);
      jsonContent = replaceExtends(assemble, jsonContent);

      const docsRefsContent = iterateJSONContentByRef(assemble, jsonContent, 'docs', 'refs');
      const dataContent = iterateJSONContentByRef(assemble, jsonContent, 'data');

      view.render({
        docs: Object.assign({}, jsonContent.docs || {}),
        partialPath: options.data.root.partial.split('/'),
        preview: html,
        style: cssmin(require('highlight.js/styles/github.css')),
        code: {
          html: hljs.highlightAuto(beautifyHTML(html.trim()), [
            'html', 'xml'
          ]).value,
          hbs: hljs.highlightAuto(options.fn().trim(), ['handlebars']).value,
          json: hljs.highlightAuto(beautifyJS(dataContent || JSON.stringify(jsonContent)), ['json']).value,
          refs: hljs.highlightAuto(beautifyJS(docsRefsContent || ''), ['json']).value
        },
        relatedPartials: getRelatedPartials(assemble, options)
      }, function (err, view) {
        if (err) { throw err; }
        cb(null, view.content);
      });
    });
  };
};

function replaceExtends (assemble, data) {
  if ('docs' in data) {
    const dataExtends = data.docs.extend || data.docs.extends;
    if (dataExtends) {
      [].concat(dataExtends).forEach(extend => {
        data = merge(data, getJSONContent(assemble, extend));
      });
      delete data.docs.extend;
      delete data.docs.extends;
    }
  }
  return data;
}

function beautifyHTML (str) {
  return beautify.html(str, {
    indent_inner_html: true,
    indent_handlebars: true,
    condense: false,
    padcomments: false,
    indent: 1,
    unformatted: [
      'a', 'sub', 'sup', 'b', 'i', 'u', 'script'
    ]
  });
}

function beautifyJS (data) {
  return beautify.js(data);
}

function getJSONContent (assemble, path) {
  const partialName = upath.join(path).replace('partials/', '');
  const partial = assemble.views.partials[partialName];

  if (partial) {
    const context = assemble.views.partials[partialName].context();
    delete context.ext;
    return context;
  } else {
    return {};
  }
}

function iterateJSONContentByRef (assemble, content, key, subKey) {
  if (content[key]) {
    content = content[key];
    if (subKey) {
      content = content[subKey] || content;
    }
    const string = JSON.stringify(content);
    // eslint-disable-next-line no-useless-backreference
    return string.replace(/\1([\\'\\"]+ref:)+\2([a-zA-Z0-9\\/-_]+)\\"/gm, function (source, prefix, value) {
      const content = getJSONContent(assemble, value);
      return iterateJSONContentByRef(assemble, content || {}, key, subKey);
    });
  } else {
    return null;
  }
}

function getRelatedPartials (assemble, options) {
  const list = [];
  let m;
  const re = /\{\{?[\\{#](mixin|extend|\\>)[\s\\"]+([\\-\w\\/]+)/g;
  while ((m = re.exec(options.fn())) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    const partial = assemble.views.partials[m[2]];

    const relatedPartialURI = upath.join(partial.base, partial.relative);
    const relativePath = upath.join(options.data.root.relativeToRoot, 'docs', relatedPartialURI.replace(upath.extname(relatedPartialURI), '.html').replace(/src\/tmpl\/partials\//, 'partials/'));

    list.push({
      title: partial.key,
      url: relativePath
    });
  }
  return list;
}
