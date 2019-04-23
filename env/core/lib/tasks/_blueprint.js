/* eslint-disable no-unused-vars */
const gulp = require('gulp');
const taskGenerator = require('../taskGenerator');

module.exports = function(name, config, watch) {
    return taskGenerator(
        name,
        config,
        watch,
        function(taskName, task, options) {
            gulp.task(taskName, function() {});
        },
        function(config, tasks, cb) {
            cb();
        }
    );
};
