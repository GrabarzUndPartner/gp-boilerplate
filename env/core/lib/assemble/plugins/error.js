'use strict';

const notify = require('gulp-notify');
const colors = require('ansi-colors');

module.exports = {
    handlebars: function (error) {
        if (error.view) {
            notifyOS('handlebars', error.view.relative, error);
            report(error.view.relative, error.message, error.stack);
            this.emit('end');
        } else {
            console.log(error);
        }
    },
    postcss: function (error) {
        const fail = error.message.split(': ');
        notifyOS(error.plugin, fail[0], error);
        report(fail[0], fail[1]);
        this.emit('end');
    },
    validate: function (error) {
        const fail = error.message.split(': ');
        notifyOS(error.plugin, fail[0], error);
        report(fail[0], fail[1]);
        this.emit('end');
    }
};

function notifyOS(plugin, file, error) {
    notify({
        title: 'task failed: ' + plugin,
        message: file + '... - See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);
}

function report(file, reason, stack) {
    var log = '';
    var chalk = colors.white.bgRed;
    log += chalk('FILE:') + ' ' + file + '\n';
    log += chalk('PROB:') + ' ' + reason + '\n';
    if (stack) {
        log += chalk('STACK:') + ' ' + stack + '\n';
    }
    console.error(log);
}
