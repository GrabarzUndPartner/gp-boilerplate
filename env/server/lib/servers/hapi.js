'use strict';

var hapi = require('hapi');
var router = require('../hapi/router');

module.exports = async function(root, config) {
    var server = new hapi.Server({ port: process.env.PORT || config.port });
    await server.start();
    console.log('Server running at:', server.info.uri);
    await router.createDefaultRoutes(server, root, config);
    return server;
};
