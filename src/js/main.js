
import parser from './services/parser';

import 'jquery/../event';
import 'jquery/../event/trigger';
import 'jquery/../data';

import 'lazysizes';

if ('webpackPublicPath' in global) {
  // eslint-disable-next-line no-undef, camelcase
  __webpack_public_path__ = global.webpackPublicPath;
}

parser.parse();
