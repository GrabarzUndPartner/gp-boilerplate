"use strict";

import './webpackPublicPath';
import 'jquery/../event';
import 'jquery/../event/trigger';
import 'jquery/../data';
import 'modernizr-loader!modernizr';
import js from 'gp-module-parser';
import './services/touchIndicator';
import packages from './packages';

js.parse(null, packages);

global.picture.ready(function() {
    console.log('READY Hurra!!!');
});


var f = ([a, b] = [1, 2], {x: c} = {x: a + b}) => console.log(a + b + c);
f();  // 6
