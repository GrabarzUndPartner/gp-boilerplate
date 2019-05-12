const path = require('upath');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const extname = require('gulp-extname');
const livereload = require('gulp-livereload');
const errorHandler = require('../assemble/plugins/error').postcss;
const taskGenerator = require('../taskGenerator');

module.exports = function (name, config, watch) {
    return taskGenerator(name, config, watch, function (taskName, task) {
        gulp.task(taskName, function () {
            var src = gulp.src(task.files.src).on('error', errorHandler);
            if (task.sourcemap) {
                src = src.pipe(sourcemaps.init()).on('error', errorHandler);
            }
            src = src
                .pipe(extname('.css'))
                .on('error', errorHandler)
                .pipe(postcss())
                .on('error', errorHandler);
            if (task.sourcemap) {
                src = src.pipe(sourcemaps.write('.')).on('error', errorHandler);
            }
            return src.pipe(gulp.dest(task.files.dest));
        });

        createWatcher(task);
    });
};

function createWatcher (task) {
    if (process.env.NODE_ENV === 'development' && task.development && task.development.watch && task.development.watch.src) {
        task.development.watch.src = task.development.watch.src.map(function (src) {
            return path.join(task.files.dest, src);
        });

        gulp.watch(task.development.watch.src).on('change', function (file) {
            livereload.changed(file);
        });
    }
}
