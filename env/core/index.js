const gulp = require('gulp');
const upath = require('upath');
const template = require('lodash/template');
const livereload = require('gulp-livereload');
const options = require('minimist')(process.argv.slice(2));
const serverConfig = require(process.cwd() + options.serverConfig);
const tasksDir = options.gulpTaskConfig;

if (tasksDir) {
    /*
     * Watch
     */
    const watch = require(process.cwd() + tasksDir + 'watch/config');

    gulp.task('watch', function (cb) {
        if (watch[process.env.NODE_ENV]) {
            livereload.listen(watch.config);
        }
        cb();
    });

    /*
     * Create Tasks
     */

    var glob = require('glob');

    var files = glob.sync('**/map.json', {
        cwd: process.cwd() + tasksDir,
        root: '/',
        absolute: false
    });

    files.forEach(function (file) {
        createTask(
            getJSON(process.cwd() + tasksDir + file, {
                destination: upath.join(serverConfig.dest),
                destination_root: upath.join(process.cwd()),
                root: upath.join(process.cwd())
            }),
            watch
        );
    });

    /*
     * Override prebuild & build task, for custom tasks sequence.
     */

    if (!gulp.task('prebuild')) {
        gulp.task('prebuild', gulp.series('clean', gulp.parallel('generates', 'copy', 'webpack:embed'), 'postcss', 'handlebars'));
    }

    if (!gulp.task('build')) {
        gulp.task('build', gulp.series('prebuild', 'webpack:app'));
    }
}

function createTask (options, watch) {
    require(options.task)(options.name, options.config, watch);
}

function getJSON (path, options) {
    return JSON.parse(template(JSON.stringify(require(path)))(options));
}

process.once('SIGINT', function () {
    process.exit(0);
});
