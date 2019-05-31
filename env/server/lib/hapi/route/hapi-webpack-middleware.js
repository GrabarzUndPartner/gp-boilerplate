/* eslint-disable import/no-unresolved */
const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');

module.exports = {
    name: 'hapi-webpack-middleware',
    version: '1.0.0',
    register: async function register (server, options) {
        const compiler = Webpack(options.webpack);
        const webpackDevConfig = options.webpackDev || {};
        const webpackHotConfig = options.webpackHot || {};
        const webpackDevMiddleware = WebpackDevMiddleware(compiler, webpackDevConfig);
        const webpackHotMiddleware = WebpackHotMiddleware(compiler, webpackHotConfig);

        function registerMiddleware (middleware, request, reply) {
            middleware(request.raw.req, request.raw.res, error => {
                if (error) {
                    throw error;
                }
                reply();
            });
        }

        server.ext({
            type: 'onRequest',
            method: async function (request, h) {
                return new Promise(async function (resolve) {
                    function reply () {
                        h.request._isReplied = request.raw.res.finished;
                        resolve(request.raw.res.finished ? h.abandon : h.continue);
                    }

                    // eslint-disable-next-line new-cap
                    registerMiddleware(webpackDevMiddleware, request, reply);
                });
            }
        });

        server.ext({
            type: 'onRequest',
            method: async function (request, h) {
                return new Promise(async function (resolve) {
                    function reply () {
                        h.request._isReplied = request.raw.res.finished;
                        resolve(request.raw.res.finished ? h.abandon : h.continue);
                    }
                    // eslint-disable-next-line new-cap
                    registerMiddleware(webpackHotMiddleware, request, reply);
                });
            }
        });
    }
};
