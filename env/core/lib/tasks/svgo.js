const taskGenerator = require('../taskGenerator');
const gulp = require('gulp');
const svgo = require('gulp-svgo');

module.exports = function (name, config, serverConfig) {
    return taskGenerator(name, config, serverConfig, function (taskName, task) {
        gulp.task(taskName, function () {
            return gulp.src(task.files.src, { ignore: task.files.ignore })
                .pipe(svgo(require(task.config)))
                .pipe(gulp.dest(task.files.dest));
        });
    });
};
