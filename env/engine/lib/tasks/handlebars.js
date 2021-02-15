/* eslint-disable complexity */

const app = require('../assemble/config');
const errorHandler = require('../assemble/plugins/error').handlebars;
const gulp = require('gulp');
const extname = require('gulp-extname');
const upath = require('upath');
const taskGenerator = require('../taskGenerator');
const livereload = require('gulp-livereload');

const WatcherObserver = require('./handlebars/WatcherObserver');
const registry = require('./handlebars/registry');
const micromatch = require('micromatch');

module.exports = function (name, config, watch) {
  // Registriert Partials und Layouts in Assemble
  gulp.task('handlebars_update', function (cb) {
    app.layouts(config.options.layouts.files.src, config.options.layouts.options);
    app.partials(config.options.partials.files.src, config.options.partials.options);
    app.data(config.options.globals.files.src, {
      namespace: function (filename, data, options) {
        return upath
          .relative(options.cwd, filename)
          .replace(upath.extname(filename), '')
          .replace(/\//g, '.');
      },
      cwd: config.options.globals.files.cwd
    });
    cb();
  });

  let watcherInitialized = false;
  let watcherObserver;

  return taskGenerator(
    name,
    config,
    watch,
    function (taskName, task, options) {
      gulp.task(taskName, function () {
        if (!watcherInitialized) {
          if (task.partialRendering && options.watchers) {
            // Register WatcherHelper for partial file rendering
            watcherObserver = new WatcherObserver();
            options.watchers.forEach(function (watcher) {
              if (watcher.options.partialRendering) {
                watcherObserver.register(watcher);
              }
            });
          }
          watcherInitialized = true;
        }

        if (task.data) {
          app.data(task.data.src, {
            namespace: function (filename, data, options) {
              return upath.relative(options.cwd, filename).replace(upath.extname(filename), '');
            },
            cwd: task.data.cwd,
            ignore: task.data.ignore
          });
        }

        app.create(task.name).use(function () {
          return function (view) {
            if (!view.layout) {
              view.layout = task.layout;
            }
          };
        });

        /**
         * PartialRendering
         */
        let hasChanges = true;
        if (task.partialRendering && watcherObserver && watcherObserver.hasChanges()) {
          const src = watcherObserver.watchers.reduce(function (result, watcher) {
            const src = micromatch(
              watcher.changedFiles.map(function (file) {
                return './' + upath.relative(process.cwd(), file);
              }),
              task.files.src
            ).map(function (file) {
              return upath.relative(upath.join(task.partialRendering.options.cwd), file);
            });
            return result.concat(src);
          }, []);
          if (src.length > 0) {
            app[task.name](src, {
              base: task.partialRendering.options.base || task.partialRendering.options.cwd || '',
              cwd: task.partialRendering.options.cwd,
              ignore: task.files.ignore
            });
          } else {
            hasChanges = false;
          }
        } else {
          app[task.name](task.files.src, {
            base: task.files.base,
            ignore: task.files.ignore
          });
        }

        let stream = app
          .toStream(task.name);
        if (hasChanges) {
          stream = stream
            .pipe(app.renderFile(getData(watch, config.resources, config.fonts)))
            .on('error', errorHandler)
            .pipe(extname())
            .on('error', errorHandler);
        }

        return stream.pipe(app.dest(task.files.dest)).on('error', errorHandler);
      });
    },
    function (config, tasks, cb) {
      gulp.series([
        'handlebars_update'
      ].concat(tasks))(function () {
        registerController(config.options.registerController).then(function () {
          livereload.changed('all');
          cb();
        });
      });
    }
  );
};

function registerController (options) {
  if (options) {
    return new Promise(function (resolve) {
      registry.reset();
      gulp.src(options.src)
        .on('data', registry.collectFromFile())
        .on('end', function () {
          resolve(registry.createRegistry());
        })
        .on('error', errorHandler);
    });
  } else {
    return Promise.resolve();
  }
}

function getData (watch, resources, fonts) {
  return {
    options: {
      watch: {
        status: watch[process.env.NODE_ENV],
        config: watch.config
      },
      resources: resources,
      fonts: fonts
    }
  };
}
