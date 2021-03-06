const fs = require('fs');
const glob = require('glob');

module.exports = function (filepath, options, cb) {
  if (arguments.length > 2) {
    glob(filepath, options, function (er, files) {
      readFiles(
        files,
        function (content) {
          cb(null, content);
        },
        '',
        filepath
      );
    });
  } else {
    arguments[1](null, arguments[0].fn());
  }
};

function readFiles (files, cb, fileContent, filepath) {
  const file = files.shift();
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', function (err, content) {
      if (err) {
        throw err;
      }
      fileContent += content;
      if (files.length) {
        readFiles(files, cb, fileContent);
      } else {
        cb(fileContent);
      }
    });
  } else {
    // eslint-disable-next-line node/no-callback-literal
    cb(`/* [Handlebars][RAW] Can't file ${filepath} */`);
  }
}
