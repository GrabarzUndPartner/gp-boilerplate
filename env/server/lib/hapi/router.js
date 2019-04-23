'use strict';

module.exports = {
    createDefaultRoutes: async function(server, root, options) {
        // optional security gate - auth must be configured inside route plugins
        try {
            await server.register([require('hapi-auth-jwt2'), require('h2o2')]);
            server.auth.strategy('jwt', 'jwt', {
                key: options.secret, // Never Share your secret key
                validate: validate // validate function defined above
            });
            const routes = options.routes.reduce(function(result, item) {
                if (item[process.env.NODE_ENV]) {
                    result.push({ plugin: item.config.module, options: Object.assign({ root: root }, item.config.options) });
                }
                return result;
            }, []);
            await server.register(routes);
        } catch (err) {
            console.log(err);
        }
    }
};

function validate(decoded, request, callback) {
    if (!decoded.auth_id) {
        return callback(null, false);
    } else {
        return callback(null, true);
    }
}
