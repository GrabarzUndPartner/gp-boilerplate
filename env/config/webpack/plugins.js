const webpack = require('webpack');
const path = require('upath');
const OptimizeJsPlugin = require('optimize-js-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pkg = require(process.cwd() + '/package.json');

module.exports = function (name) {
  return [
    {
      development: true,
      production: true,
      build: true,
      config: new webpack.BannerPlugin(pkg.name)
    },
    {
      development: true,
      production: true,
      build: true,
      config: new webpack.DefinePlugin({
        // 'process.env': {
        //     'NODE_ENV': JSON.stringify('production')
        // }
      })
    },
    {
      development: true,
      production: true,
      build: true,
      config: new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'root.jQuery': 'jquery'
      })
    },
    {
      development: true,
      production: true,
      build: true,
      config: new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    },

    {
      development: false,
      production: false,
      build: true,
      config: new OptimizeJsPlugin({
        sourceMap: false
      })
    },
    {
      development: false,
      production: true,
      build: true,
      config: new BundleAnalyzerPlugin({
        reportFilename: path.resolve(`reports/webpack/${name}.html`),
        statsFilename: path.resolve(`reports/webpack/stats/${name}.json`),
        analyzerMode: 'static',
        generateStatsFile: true,
        openAnalyzer: false,
        logLevel: 'info',
        defaultSizes: 'gzip',
        statsOptions: 'normal'
      })
    },
    {
      development: true,
      production: false,
      build: false,
      config: new webpack.HotModuleReplacementPlugin()
    },
    {
      development: true,
      production: false,
      build: false,
      config: new webpack.NoEmitOnErrorsPlugin()
    }
  ];
};
