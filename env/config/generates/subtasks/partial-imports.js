const gulp = require('gulp');
const glob = require('glob');
const path = require('upath');
const fs = require('fs-extra');

/**
 * Erzeugt partials.pcss und partials.critical.pcss anhand der an src/pcss/partials enthaltenen Dateien.
 * \/src\/pcss\/**\/*.pcss -> partials.pcss
 * \/src\/pcss\/**\/*.critical.pcss -> partials.critical.pcss
 */

module.exports = function generateImports (config) {
    const render = function () {
        updateImports(config.files);
    };
    if (process.env.NODE_ENV === 'development' && config.development && config.development.watch && config.development.watch.src) {
        gulp.watch(config.development.watch.src)
            .on('add', render)
            .on('unlink', render);
    }
    render();
};

function updateImports (files) {
    return files.map(function (data) {
        const css = glob
            .sync(data.src, { ignore: data.ignore })
            .map(function (file) {
                return `@import "${path.resolve(file)}";`;
            })
            .join('\n');
        fs.mkdirsSync(path.dirname(data.dest));
        fs.writeFileSync(data.dest, css);
    });
}
