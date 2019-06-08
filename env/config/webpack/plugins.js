const webpack = require('webpack');
const OptimizeJsPlugin = require('optimize-js-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

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
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: name + '.report.html',
        generateStatsFile: true,
        statsFilename: name + '.stats.json',
        logLevel: 'info'
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
    },
    // PWA
    {
      development: false,
      production: true,
      build: true,
      config: new WorkboxPlugin.GenerateSW({
        swDest: '../service-worker.js',
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true
      })
    },
    {
      development: false,
      production: true,
      build: true,
      config: new WebpackPwaManifest(require('./pwa/manifest'))
    }
    // {
    //     development: false,
    //     production: true,
    //     build: true,
    //     config: new SWPrecacheWebpackPlugin({
    //         cacheId: 'my-domain-cache-id',
    //         dontCacheBustUrlsMatching: /\.\w{8}\./,
    //         filename: '../service-worker.js',
    //         // filepath: '',
    //         minify: true,
    //         // navigateFallback: PUBLIC_PATH + 'index.html',
    //         staticFileGlobsIgnorePatterns: [
    //             /\.map$/, /manifest\.json$/
    //         ]
    //     })
    // }
  ];
};
