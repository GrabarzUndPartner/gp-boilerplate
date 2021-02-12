module.exports = {

  publicPath: '/dev/js/',
  // public path to bind the middleware to
  // use the same as in webpack

  // watchOptions: {
  //   ignored: /node_modules|dev|build|production|env|generated/,
  //   aggregateTimeout: 1000,
  //   poll: true
  // },
  // watch options (only lazy: false)

  index: 'dev/index.html',
  // the index path for web server

  headers: {
    'X-Custom-Header': 'yes'
  },
  // custom headers

  stats: {
    clearInvalid: true,
    strictHeader: false,
    colors: true
  },
  // options for formating the statistics

  // reporter: null,
  // // Provide a custom reporter to change the way how logs are shown.

  serverSideRender: false
  // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
};
