module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-assets': {},
        precss: {},
        'postcss-preset-env': {
            browsers: ['> 2%', 'last 2 versions', 'IE 11', 'Firefox ESR'],
            stage: 0,
            features: {
                'nesting-rules': true
            }
        },
        'postcss-calc': {
            precision: 5
        },
        'postcss-object-fit-images': {},
        'postcss-clearfix': {},
        'postcss-discard-comments': {},
        cssnano: {
            autoprefixer: false,
            zindex: false
        },
        'postcss-browser-reporter': {},
        'postcss-reporter': {}
    }
};
