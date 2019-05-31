module.exports = [
    {
        development: true,
        production: false,
        config: {
            module: require('../../server/lib/hapi/route/hapi-webpack-middleware'),
            options: {
                webpack: Object.assign(require('../webpack/config')('app'), {
                    entry: {
                        app: [
                            './src/js/main', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
                        ],
                        docs: [
                            './src/js/docs', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
                        ]

                    },
                    output: {
                        path: '/dev/js',
                        filename: '[name].js',
                        publicPath: '/dev/js/',
                        library: ['[name]'],
                        chunkFilename: 'app.[chunkhash].js'
                    }
                }),
                webpackDev: require('../../config/hapi/server/dev'),
                webpackHot: require('../../config/hapi/server/hot')
            }
        }
    },
    // {
    //     development: true,
    //     production: false,
    //     config: {
    //         module: require('./routes/debug'),
    //         options: {}
    //     }
    // },
    {
        development: true,
        production: true,
        config: {
            module: require('../../server/lib/hapi/route/static'),
            options: {
                config: {
                    state: {
                        parse: false,
                        failAction: 'ignore'
                    }
                }
            }
        }
    }
    // {
    //     development: true,
    //     production: false,
    //     config: {
    //         module: require('../../server/lib/hapi/route/proxy'),
    //         options: {}
    //     }
    // }
];
