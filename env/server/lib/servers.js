const options = require('minimist')(process.argv.slice(2));
const serverConfig = require(process.cwd() + options.serverConfig);
const ip = require('./services/ip');
const path = require('path');

function init (config) {
  const server = require(path.join(__dirname, '/servers/hapi'))(config.root, config.hapi);
  config.servers.forEach(function (item) {
    item.module(server, item.config);
  });
}

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
