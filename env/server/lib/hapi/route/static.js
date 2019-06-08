var Inert = require('inert');
var extend = require('lodash/extend');

module.exports = {
  name: 'static',
  version: '1.0.0',
  register: async function (server, options) {
    try {
      await server.register(Inert);
      await server.route({
        method: 'GET',
        path: '/{param*}',
        config: extend(
          {
            auth: false // false or 'jwt'
          },
          options.config || {}
        ),
        handler: {
          directory: {
            path: options.root
            // listing: true
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};
