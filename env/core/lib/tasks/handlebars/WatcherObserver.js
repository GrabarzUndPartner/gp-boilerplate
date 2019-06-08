const upath = require('upath');
const fs = require('fs');
const uniq = require('uniq');
const ansiColors = require('ansi-colors');

const DEBUG = false;

const regexIsHBS = new RegExp(/\.hbs$/);
const regexPartial = new RegExp(/\{\{?[#]?(mixin|extend|>) ["']([\\-\w\\/]+)["']/g);

class WatcherWrapper {
  constructor (watcher) {
    this.watcher = watcher;
    this.fileParentMap = {};
    this.changedFiles = null;
    this.ready = new Promise(function (resolve) {
      if (watcher.options.ignoreInitial) {
        resolve();
      } else {
        watcher.on('ready', resolve);
      }
    }).then(() => {
      return this.onReady(watcher);
    });
  }

  /**
   * Functions
   */

  getRenderFiles (path) {
    let files = [
      path
    ];
    (this.fileParentMap[path] || []).forEach(parent => {
      files = files.concat(this.getRenderFiles(parent));
    });
    return files;
  }

  addedParentsFromFile (path) {
    var content = fs.readFileSync(path).toString();
    var result;
    var childs = [];
    while ((result = regexPartial.exec(content)) !== null) {
      childs.push(result[2]);
    }
    uniq(childs);
    childs = childs.map(value => {
      var partial = 'partials/' + value + '.hbs';
      return upath.join(this.cwd(), this.watcher.options.base, partial);
    });

    childs.forEach(child => {
      this.fileParentMap[child] = this.fileParentMap[child] || [];
      this.fileParentMap[child].push(path);
      uniq(this.fileParentMap[child]);
    });
    // Alte referenzierungen entfernen
    for (var key in this.fileParentMap) {
      if (this.fileParentMap[key] && this.fileParentMap[key].indexOf(path) > -1 && childs.indexOf(key) === -1) {
        // Eintrag existiert noch, wird aber nicht mehr benoetigt.
        this.fileParentMap[key].splice(this.fileParentMap[key].indexOf(path), 1);
      }
    }
    return childs;
  }

  /**
   * Events
   */

  onAll (type, path) {
    switch (type) {
      case 'rename':
        return this.onRename(path);
      case 'change':
        return this.onChange(path);
      case 'add':
        return getFilesFromPath(path).forEach(file => {
          this.onAdded(file);
        });
      case 'unlink':
        return this.onUnlink(path);
    }
  }

  cwd () {
    return process.cwd();
  }

  /**
   * Ruft aus dem Watcher alle Dateien ab und registriert diese.
   */
  registerFiles () {
    const files = [];
    const filesMap = this.watcher.getWatched();
    getFilesFromMap(filesMap).map(path => {
      var childs = this.addedParentsFromFile(path);
      var name = upath.relative(upath.join(this.cwd(), this.watcher.options.base), path);
      return {
        path: path,
        name: name,
        childs: childs
      };
    });
    return files;
  }

  onReady () {
    const watcher = this.watcher;

    watcher.on('all', (type, value) => {
      this.onAll(type, value, watcher);
    });

    this.registerFiles();

    debugFileMap(this.fileParentMap);
    return this;
  }

  onChange (path) {
    this.addedParentsFromFile(path);
    var files = this.getRenderFiles(path);
    uniq(files);
    files = files.map(function (file) {
      return file;
    });
    if (DEBUG) {
      console.log('changed files', files);
    }
    this.changedFiles = files;
    debugFileMap(this.fileParentMap);
  }

  onAdded (path) {
    debugFileMap(this.fileParentMap, 'From');
    this.addedParentsFromFile(path);
    debugFileMap(this.fileParentMap, 'To');
  }

  onUnlink (path) {
    debugFileMap(this.fileParentMap, 'From');
    for (var key in this.fileParentMap) {
      if (this.fileParentMap[key]) {
        if (this.fileParentMap[key].indexOf(path) > -1) {
          this.fileParentMap[key].splice(this.fileParentMap[key].indexOf(path), 1);
        }
      }
    }
    debugFileMap(this.fileParentMap, 'To');
  }

  onRename (path) {
    debugFileMap(this.fileParentMap, 'From');
    this.addedParentsFromFile(path);
    debugFileMap(this.fileParentMap, 'To');
  }
}

class WatcherObserver {
  constructor () {
    this.watchers = [];
  }

  /**
   * Functions
   */

  hasChanges () {
    return !!this.watchers.find(function (watcher) {
      return watcher.changedFiles && watcher.changedFiles.length > 0;
    });
  }

  register (watcher) {
    this.watchers.push(new WatcherWrapper(watcher));
  }
}

function getFilesFromMap (filesMap) {
  return Object.keys(filesMap).reduce((result, path) => {
    filesMap[path].forEach(name => {
      const file = upath.resolve(path, name);
      if (regexIsHBS.test(file)) {
        result.push(file);
      }
    });
    return result;
  }, []);
}

function getFilesFromPath (path, files) {
  files = files || [];
  if (fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file) {
      getFilesFromPath(upath.join(path, file), files);
    });
  } else {
    files.push(path);
  }
  return files;
}

function debugFileMap (fileMap, title) {
  if (DEBUG) {
    if (title) {
      console.log(ansiColors.bold('-----------------------'));
      console.log(ansiColors.bold(title));
    }

    for (var key in fileMap) {
      if (fileMap[key]) {
        console.log(ansiColors.bold.green(key));
        debugFileMapLogFiles(fileMap[key]);
      }
    }
    if (title) {
      console.log(ansiColors.bold('-----------------------'));
    }
  }
}

function debugFileMapLogFiles (fileMap) {
  fileMap.forEach(function (file) {
    console.log(ansiColors.bold.gray('File:'), ansiColors.bold.black(file));
  });
}

module.exports = WatcherObserver;
