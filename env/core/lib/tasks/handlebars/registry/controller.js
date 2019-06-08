const uniqWith = require('lodash/uniqWith');
const isEqual = require('lodash/isEqual');
const template = require('./controller/template.hbs');
const fs = require('fs');
const mkdirp = require('mkdirp');
const upath = require('upath');
const ansiColors = require('ansi-colors');
const getDirName = upath.dirname;

let controllers = [];

module.exports = {
  reset: function () {
    controllers = [];
  },
  collect: function ($) {
    addControllersToList($('.controller[data-controller]'));
    return $;
  },
  createRegistry: function (registry) {
    return new Promise(function (resolve) {
      controllers = uniqWith(controllers, isEqual);
      writeFile(
        (registry || {}).file || upath.join('src', 'js', 'packages.js'),
        template({
          controllers
        }),
        function () {
          console.log(ansiColors.bold.green('saved file:'), ansiColors.bold.black('packages.js'));
          resolve();
        }
      );
    });
  }
};

function addControllersToList (nodes) {
  for (let i = 0; i < nodes.length; i++) {
    const name = nodes.eq(i).data('controller');
    const controller = name;

    let async = nodes.eq(i).data('controller-async') || false;
    if (typeof async === 'string') {
      async = `'${async}'`;
    }

    controllers.push({
      name,
      controller,
      async
    });
  }
}

function writeFile (path, content, cb) {
  mkdirp(getDirName(path), function (err) {
    if (err) {
      return cb(err);
    }
    fs.writeFile(path, content, cb);
  });
}
