const options = require('minimist')(process.argv.slice(2));
const serverConfig = require(process.cwd() + options.serverConfig);
const ip = require('./services/ip');

module.exports = (function (config) {
    if (options.ip) {
        if (options.ip === 'true') {
            config.hapi.host = ip();
        } else {
            config.hapi.host = options.ip;
        }
    }
    init(config);
})(serverConfig);

function init (config) {
    const server = require(__dirname + '/servers/hapi')(config.root, config.hapi);
    config.servers.forEach(function (item) {
        item.module(server, item.config);
    });
}
