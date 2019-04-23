const path = require('path');

module.exports = {
    filename: '../manifest.json',
    publicPath: 'js/',
    includeDirectory: true,
    name: 'My Progressive Web App',
    short_name: 'MyPWA',
    description: 'My awesome Progressive Web App!',
    background_color: '#ffffff',
    crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
    icons: [
        {
            src: path.resolve('src/assets/favicon.png'),
            sizes: [96, 128, 192, 256, 384, 512]
        }
    ]
};
