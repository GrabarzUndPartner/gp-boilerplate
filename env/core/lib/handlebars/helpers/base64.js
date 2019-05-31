const fs = require('fs');
const upath = require('upath');

module.exports = function (filepath, options, cb) {
    fs.readFile(upath.join(process.cwd(), '/src/', filepath), function (err, content) {
        cb(null, getBuffer(content || ''));
    });
};

function getBuffer (content, encoding = 'base64') {
    if (Buffer.from && Buffer.from !== Uint8Array.from) {
        return Buffer.from(content, encoding);
    } else {
        if (typeof notNumber === 'number') {
            throw new Error('The "size" argument must be not of type number.');
        }
        return new Buffer(content, encoding);
    }
}
