const gulp = require('gulp');
const svgSymbols = require('gulp-svg-symbols');
const rename = require('gulp-rename');
const taskGenerator = require('../taskGenerator');
const path = require('upath');

module.exports = function (name, config, serverConfig) {
  return taskGenerator(name, config, serverConfig, function (taskName, task) {
    gulp.task(taskName, function () {
      return gulp.src(task.files.src)
        .pipe(svgSymbols(createConfig(task.name, task.prefix)))
        .pipe(rename({
          basename: task.name
        }))
        .pipe(gulp.dest(config.dest));
    });
  },
  function (config, tasks, cb) {
    gulp.parallel(tasks)(cb);
  });
};

function createConfig (name, prefix) {
  prefix = prefix || '';
  return {
    svgAttrs: {
      class: name
    },
    id: '%f',
    class: `.${prefix}%f`,
    templates: [
      path.join(__dirname, 'svg-symbols', 'template.pcss'),
      path.join(__dirname, 'svg-symbols', 'template.svg')
    ],
    slug: function (name) {
      return name.replace(/[^a-zA-Z0-9_]/g, '_');
    },
    transformData: function (svg, data) {
      return {
        id: prefix + data.id,
        className: data.className,
        width: svg.width + 'px',
        height: svg.height + 'px',
        prefix: prefix,
        ratio: svg.height / svg.width,
        filename: `${name}.svg`
      };
    }
  };
}
