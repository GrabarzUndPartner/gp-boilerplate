/* eslint-disable complexity */

const gulp = require('gulp');

module.exports = function (name, config, watch, taskPattern, mainTask) {
    let options = {
        watchers: []
    };

    const tasks = (config.subtasks || []).map(function (task) {
        var taskName = name + ':' + task.name;
        taskPattern(taskName, task, options);
        return taskName;
    });

    gulp.task(name, function (cb) {
        if (cb) {
            if (mainTask) {
                mainTask(config, tasks, cb);
            } else {
                gulp.series(tasks)(cb);
            }
        } else {
            return tasks;
        }
    });

    if (watch[process.env.NODE_ENV]) {
        options.watchers = (config.watch || []).map(function (watch) {
            watch.options = Object.assign({ partialRendering: watch.partialRendering }, watch.options);
            if (!watch.tasks) {
                return gulp.watch(watch.src, watch.options || {}, gulp.series(name));
            } else {
                return gulp.watch(
                    watch.src,
                    watch.options || {},
                    gulp.series(
                        watch.tasks.map(function (task) {
                            return name + ':' + task;
                        })
                    )
                );
            }
        });
    }
};
