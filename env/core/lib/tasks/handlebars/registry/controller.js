const uniqBy = require('lodash/uniqBy');
const template = require('./controller/template.hbs');
const fs = require('fs');
const mkdirp = require('mkdirp');
const upath = require('upath');
const ansiColors = require('ansi-colors');
const getDirName = upath.dirname;

let list = [];

module.exports = {
    reset: function() {
        list = [];
    },
    collect: function($) {
        addControllersToList($('.controller[data-controller]'));
        return $;
    },
    createRegistry: function(registry) {
        return new Promise(function(resolve) {
            list = uniqBy(list, 'controller');
            writeFile(
                (registry || {}).file || upath.join('src', 'js', 'packages.js'),
                template({
                    sources: list
                }),
                function() {
                    console.log(ansiColors.bold.green('saved file:'), ansiColors.bold.black('packages.js'));
                    resolve();
                }
            );
        });
    }
};

function addControllersToList(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        const name = nodes.eq(i).data('controller');
        const controller = name;
        list.push({
            name: name,
            controller: controller,
            chunk: nodes.eq(i).data('chunk') || false
        });
    }
}

function writeFile(path, content, cb) {
    mkdirp(getDirName(path), function(err) {
        if (err) {
            return cb(err);
        }
        fs.writeFile(path, content, cb);
    });
}
