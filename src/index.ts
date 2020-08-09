import debug from 'debug';
import chokidar from 'chokidar';
import { join, sep, dirname } from 'path';
import { readdirSync, existsSync, lstatSync } from 'fs';

const myDebug = debug('express-hot-reload-dev');
const blockFolderNames = [
  'node_modules'
];

declare global {
  interface String {
    toFolder(): string;
  }
}
String.prototype.toFolder = function () {
  const that = this.toString();
  return join(that, '/');
}

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

export const hotReload = (watchFolder, isDebug = false) => {

  myDebug.enabled = isDebug;

  const reWin = new RegExp('\\' + sep, 'g');
  let wPath = watchFolder;

  const isFolderDirExisted = existsSync(wPath) && lstatSync(wPath).isDirectory();
  if (isFolderDirExisted) {
    wPath = wPath.replace(reWin, '/').toFolder();
  } else {
    wPath = dirname(wPath).replace(reWin, '/').toFolder();
  }
  myDebug('watch folder', wPath);

  const notAllow = getDirectories(wPath).some(n => blockFolderNames.indexOf(n) === 0);
  if (notAllow) {
    throw new Error(`please dont include "${blockFolderNames.join(', ')}" folders`);
  }

  const watcher = chokidar.watch(wPath);
  watcher.on('ready', () => {
    watcher.on('all', () => {
      Object.keys(require.cache)
        .forEach((id) => {
          const cId = id.replace(reWin, '/');
          if (cId.indexOf(wPath) === 0) {
            myDebug('=> deleting cache key', id.replace(reWin, '/'));
            delete require.cache[id];
          }
        })
    })
  })

  return (routerPath) => {
    require(routerPath);
    return (req, res, next) => {
      myDebug('require hot reload');
      require(routerPath)(req, res, next);
    }
  }
}
