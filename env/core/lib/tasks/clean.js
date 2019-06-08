const gulp = require('gulp');
const del = require('del');
const taskGenerator = require('../taskGenerator');

module.exports = function (name, config, serverConfig) {
  return taskGenerator(name, config, serverConfig, function (taskName, task) {
    gulp.task(taskName, function () {
      return del(task.files.dest, { force: true });
    });
  });
};
