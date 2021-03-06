const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const upath = require('upath');
const taskGenerator = require('../taskGenerator');

const isDev = process.env.NODE_ENV === 'development';
const mode = isDev ? 'development' : 'production';

module.exports = function (name, config, serverConfig) {
  return taskGenerator(name, config, serverConfig, function (taskName, task) {
    gulp.task(taskName, function () {
      return gulp
        .src(task.files.src)
        .pipe(
          webpackStream(
            Object.assign(
              {
                entry: task.entry,
                output: {
                  path: process.cwd() + '/' + upath.dirname(task.files.dest),
                  filename: upath.basename(task.files.dest),
                  library: task.files.library,
                  publicPath: task.files.publicPath || '/',
                  chunkFilename: task.files.chunkFilename || '[id].js'
                }
              },
              require(task.config)(task.name),
              { mode }
            ),
            webpack
          )
        )
        .pipe(gulp.dest(upath.dirname(task.files.dest)));
    });
  });
};
