const glob = require('glob');
const upath = require('upath');
const exts = require('ext-map');

module.exports = function (filepath, opt, cb) {
  var content = '';
  glob(filepath, {}, function (er, files) {
    files.forEach(function (file) {
      content += opt.fn(upath.changeExt(upath.relative(upath.dirname(opt.data.root.originalPath), file), exts[upath.extname(file)]));
    });
    cb(er, content);
  });
};
