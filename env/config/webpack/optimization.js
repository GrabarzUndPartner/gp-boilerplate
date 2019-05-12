module.exports = [{
        development: false,
        production: true,
        build: true,
        config: {
            minimizer: [compiler => {
                    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
                    new UglifyJsPlugin({
                        sourceMap: true,
                        extractComments: true,
                        uglifyOptions: {
                            mangle: true,
                            ie8: false,
                            acorn: true,
                            warnings: true,
                            compress: {
                                sequences: true,
                                properties: true,
                                dead_code: true,
                                drop_debugger: true,
                                conditionals: true,
                                comparisons: true,
                                evaluate: true,
                                booleans: true,
                                loops: true,
                                unused: true,
                                hoist_funs: true,
                                hoist_vars: false,
                                if_return: true,
                                join_vars: true,
                                negate_iife: true,
                                pure_getters: false,
                                drop_console: true
                            }
                        }
                    }).apply(compiler);
                }]
        }
    }];
