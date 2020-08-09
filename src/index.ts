import dd from 'debug';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';

const debug = dd('express-hot-reload');

declare global {
  interface String {
    toFolder(): string;
  }
}
String.prototype.toFolder = function () {
  const that = this.toString();
  return path.join(that, '/');
}

export const hotReload = (watchFolder, isDebug = false) => {

  debug.enabled = isDebug;

  const reWin = new RegExp('\\' + path.sep, 'g');
  let wPath = watchFolder;

  const isFolderDirExisted = fs.existsSync(wPath) && fs.lstatSync(wPath).isDirectory();
  if (isFolderDirExisted) {
    wPath = wPath.replace(reWin, '/').toFolder();
  } else {
    wPath = path.dirname(wPath).replace(reWin, '/').toFolder();
  }

  // ignoreFolders = ignoreFolders.map(a => a.replace(reWin, '/').toFolder());

  debug('watch folder', wPath);
  // debug('ignore folder', ignoreFolders);
  // const watcher = chokidar.watch(wPath, {
  //   ignored: (p => {
  //     const isIgnored = ignoreFolders.some(ig => p.indexOf(ig) === 0);
  //     if (isIgnored) {
  //       // debug('ignore folder', p)
  //       return true;
  //     }
  //     return false;
  //   }),
  //   persistent: true
  // });
  const watcher = chokidar.watch(wPath);
  const re = new RegExp(wPath);
  watcher.on('ready', function () {
    watcher.on('all', function () {
      Object.keys(require.cache)
        .forEach(function (id) {
          const cId = id.replace(reWin, '/');
          if (cId.indexOf(wPath) === 0) {
            debug('=> deleting cache key', id.replace(reWin, '/'));
            delete require.cache[id];
          }
        })
    })
  })

  return (routerPath) => {
    require(routerPath);
    return (req, res, next) => {
      debug('require hot reload');
      require(routerPath)(req, res, next);
    }
  }
}
