const fs = require('fs');
const upath = require('upath');
const cheerio = require('cheerio');

const ASSETS_PATH = 'assets/svg-symbols';
const IGNORED_ATTRS = [
  'embed', 'extern', 'xmlns', 'viewBox'
];

module.exports.svgSymbol = function (name, id, options, cb) {
  const assetPath = options.hash.assetPath || ASSETS_PATH;
  name = name.toString();
  id = id.toString();

  loadMap(name, options).then(function (data) {
    const symbol = data.$(`#${name}_${id}`);

    if (symbol.length < 1) {
      throw new Error(`Can't find symbol id "${id}" in symbols "${name}"`);
    }

    setUsedSymbols(options, name);

    const isEmbed = options.hash.embed; const isExtern = options.hash.extern;

    const attrs = [
      'xmlns="http://www.w3.org/2000/svg"'
    ];

    const viewBox = symbol.attr('viewbox') || symbol.attr('viewBox');
    if (viewBox) {
      attrs.push(`viewBox="${viewBox}"`);
    }

    Object.keys(options.hash).forEach(function (name) {
      if (IGNORED_ATTRS.indexOf(name) < 0) {
        attrs.push(`${name}="${options.hash[name].toString()}"`);
      }
    });

    let html;
    html = `<svg${attrs.length ? ' ' + attrs.join(' ') : ''}>`;

    if (isEmbed) {
      html += symbol.html();
    } else {
      let href;
      if (isExtern) {
        href = upath.join(options.data.root.relativeToRoot, assetPath, `${name}.svg#${name}_${id}`);
      } else {
        href = upath.join(`#${name}_${id}`);
      }
      html += `<use xlink: href="${href}" />`;
    }
    html += '</svg>';
    cb(null, html);
  })
    .catch(function (e) {
      cb(e);
    });
};

function setUsedSymbols (options, name) {
  const isEmbed = options.hash.embed; const isExtern = options.hash.extern;
  options.data.root.usedSymbols = options.data.root.usedSymbols || [];
  if (options.data.root.usedSymbols.indexOf(name) < 0) {
    if (!isEmbed && !isExtern) {
      options.data.root.usedSymbols.push(name);
    }
  }
}

module.exports.svgSymbols = function (options, cb) {
  let usedSymbols; let html = '';
  if (options.hash.force) {
    usedSymbols = Object.keys(fileCache);
  } else {
    usedSymbols = options.data.root.usedSymbols || [];
  }

  usedSymbols.map(function (name) {
    if (fileCache[name]) {
      html += fileCache[name].content;
    }
  });
  cb(null, html);
};

const fileCache = {};

function loadMap (name, options) {
  return new Promise(resolve => {
    if (fileCache[name]) {
      resolve(fileCache[name]);
    }
    if (!(name in options.data.root.options.resources.symbols)) {
      throw new Error(`Can't find Handlebars symbols resource "${name}"`);
    }
    const path = upath.join(process.cwd(), options.data.root.options.resources.symbols[name]);

    fs.readFile(path, 'utf-8', function (err, content) {
      if (err) {
        throw err;
      }
      fileCache[name] = { content, $: cheerio.load(content) };
      resolve(fileCache[name]);
    });
  });
}
