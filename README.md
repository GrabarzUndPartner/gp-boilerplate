# Boilerplate - Grabarz & Partner

[![NPM version](https://badge.fury.io/gh/GrabarzUndPartner%2gp-boilerplate.svg)](https://badge.fury.io/gh/GrabarzUndPartner%2gp-boilerplate)
[![Build Status](https://img.shields.io/travis/GrabarzUndPartner/gp-boilerplate.svg?style=flat&label=Linux%20build)](https://travis-ci.org/GrabarzUndPartner/gp-boilerplate)
[![Windows Build status](https://img.shields.io/appveyor/ci/GrabarzUndPartner/gp-boilerplate.svg?style=flat&label=Windows%20build)](https://ci.appveyor.com/project/GrabarzUndPartner/gp-boilerplate)
[![Dependency Status](https://img.shields.io/david/GrabarzUndPartner/gp-boilerplate.svg?style=flat)](https://david-dm.org/GrabarzUndPartner/gp-boilerplate)
[![devDependency Status](https://img.shields.io/david/dev/GrabarzUndPartner/gp-boilerplate.svg?style=flat)](https://david-dm.org/GrabarzUndPartner/gp-boilerplate#info=devDependencies) [![Greenkeeper badge](https://badges.greenkeeper.io/GrabarzUndPartner/gp-boilerplate.svg)](https://greenkeeper.io/)

This boilerplate structure including tasks and servers should help you to develop modular websites + documentation per partial.

## Boilerplate specs

The boilerplate based on [gulp](https://github.com/gulpjs/gulp) and [assemble (beta-5)](https://github.com/assemble/assemble).

### Implemented tasks

Those tasks are configured by default:

- clean
- copy
- handlebars-compiler
- postcss-compiler
- purecss-generator
- sitemap-generator
- watch-handler
- webpack-bundler

They could be modified by [env/tasks.json](./env/tasks.json).

### Implemented servers

Those servers are configured by default:

- hapijs
- hapijs-webpack-dev-server
- livereload
- weinre

They could be modified by [env/local.json](./env/local.json).

## Setup your environment

At first install the latest stable [node.js](https://nodejs.org/en/) version (>=5.1.0) by homebrew.

```
brew install node
```

When nodejs is installed you can run

```
npm install
```

The installation process should run without some errors.

### Test the environment

To verify a working environment just run the following command in the root folder of your project.

```
npm test
```

It should build all sources into the 'build'-directory of your project root folder. No error message should be shown in your console.

### Run development-environment

```
npm run dev
```

Url: http://127.0.0.1:8050/dev/

### Run production-environment

```
npm run prod
```

Url: http://127.0.0.1:8050/

### Run production / development with IP

```bash
npm run dev -- --ip=0.0.0.0
```

### Build production-environment

```
npm run build
```

## Documentation

The documentation can be found in the subdirectory "docs".

| Enviroment | Url                            |
| ---------- | ------------------------------ |
| dev        | http://127.0.0.1:8050/dev/docs |
| production | http://127.0.0.1:8050/docs     |




