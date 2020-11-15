const through = require('through2');
const cheerio = require('cheerio');
const controller = require('./registry/controller');

module.exports = {
  reset: function () {
    controller.reset();
  },
  collect: function () {
    return through.obj(function (file, enc, cb) {
      if (file.contents) {
        const $ = cheerio.load(file.contents.toString(enc));
        controller.collect($);
      }
      cb();
    });
  },
  collectFromFile: function () {
    const enc = 'utf-8';
    return function (file) {
      if (file.contents) {
        const $ = cheerio.load(file.contents.toString(enc));
        controller.collect($);
      }
    };
  },
  createRegistry: function (controllerRegistry) {
    controller.createRegistry(controllerRegistry);
  }
};
