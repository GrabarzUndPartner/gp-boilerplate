var gulp = require('gulp');
// Environments
require('./env/core');
require('./env/server');

gulp.task('default', gulp.series('server'));

gulp.task('run', function (cb) {
    if (process.env.NODE_ENV === 'development') {
        gulp.series('prebuild', 'watch', 'default')(cb);
    } else if (process.env.NODE_ENV === 'production') {
        gulp.series('build', 'server')(cb);
    }
});
