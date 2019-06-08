const gulp = require('gulp');
const changed = require('gulp-changed');
const livereload = require('gulp-livereload');
const taskGenerator = require('../taskGenerator');

module.exports = function (name, config, serverConfig) {
  return taskGenerator(name, config, serverConfig, function (taskName, task) {
    gulp.task(taskName, function () {
      return gulp
        .src(task.files.src, { ignore: task.files.ignore })
        .pipe(changed(task.files.dest, { hasChanged: changed.compareLastModifiedTime }))
        .pipe(gulp.dest(task.files.dest))
        .pipe(livereload());
    });
  });
};
