const postcss = require('postcss');
const fs = require('fs-extra');
const postcssBootstrap4Grid = require('postcss-bootstrap-4-grid');

module.exports = async function (config) {
    await postcss([postcssBootstrap4Grid(config.options)])
        .process('@bootstrap-4-grid;', { from: null })
        .then(async result => {
            await fs.writeFile(config.dest.grid, result.css);
        });

    await createMediaFile(config);
};

async function createMediaFile (config) {
    const vars = {};
    const DEFEAULT_UNIT = 'px';

    const unit = config.options.unit || DEFEAULT_UNIT;
    const breakpointValues = config.options.gridBreakpoints;
    const breakpoints = ['default'].concat(Object.keys(config.options.gridBreakpoints));

    breakpoints.forEach(function (breakpoint, i) {
        if (breakpointValues[breakpoint]) {
            vars[`--${breakpoint}`] = `(min-width: ${breakpointValues[breakpoint]})`;
        } else {
            vars[`--${breakpoint}`] = 'all';
        }

        if (breakpoints[i + 1]) {
            vars[`--${breakpoint}-max`] = `(max-width: ${parseInt(breakpointValues[breakpoints[i + 1]]) - 1}${unit})`;
            if (vars[`--${breakpoint}`]) {
                vars[`--${breakpoint}-min-max`] = `${vars[`--${breakpoint}`]} and ${vars[`--${breakpoint}-max`]}`;
            }
        }
    });

    await fs.writeFile(
        config.dest.mediaVars,
        Object.keys(vars)
            .map(function (name) {
                return `@custom-media ${name} ${vars[name]};`;
            })
            .join('\n') + '\n'
    );
}
