const gulp = require('gulp');
const options = require('minimist')(process.argv.slice(2));
const serverConfig = require(process.cwd() + options.serverConfig);
const upath = require('upath');

gulp.task('server', function(cb) {
    const server = upath.resolve(options.server + '/lib/servers');
    if (serverConfig.dev) {
        require('gulp-nodemon')({
            script: server,
            ignore: ['**/*'],
            args: ['--serverConfig=' + options.serverConfig, options.ip ? '--ip=' + options.ip : '']
        });

        process.once('SIGINT', function() {
            process.exit(0);
        });
    } else {
        require(server);
    }

    if (options.timeout) {
        setTimeout(function() {
            process.exit(0);
        }, +options.timeout);
    }
    cb();
});
