const gulp = require('gulp');
const taskGenerator = require('../taskGenerator');

module.exports = function(name, config, serverConfig) {
    return taskGenerator(
        name,
        config,
        serverConfig,
        function(taskName, task) {
            gulp.task(taskName, async function(cb) {
                const subTask = require(task.file);
                await subTask(task.config);
                cb();
            });
        },
        function(config, tasks, cb) {
            gulp.parallel(tasks)(cb);
        }
    );
};
