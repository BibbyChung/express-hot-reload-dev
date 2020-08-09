"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotReload = void 0;
const debug_1 = __importDefault(require("debug"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = require("path");
const fs_1 = require("fs");
const myDebug = debug_1.default('express-hot-reload-dev');
const blockFolderNames = [
    'node_modules'
];
String.prototype.toFolder = function () {
    const that = this.toString();
    return path_1.join(that, '/');
};
const getDirectories = source => fs_1.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
exports.hotReload = (watchFolder, isDebug = false) => {
    myDebug.enabled = isDebug;
    const reWin = new RegExp('\\' + path_1.sep, 'g');
    let wPath = watchFolder;
    const isFolderDirExisted = fs_1.existsSync(wPath) && fs_1.lstatSync(wPath).isDirectory();
    if (isFolderDirExisted) {
        wPath = wPath.replace(reWin, '/').toFolder();
    }
    else {
        wPath = path_1.dirname(wPath).replace(reWin, '/').toFolder();
    }
    myDebug('watch folder', wPath);
    const notAllow = getDirectories(wPath).some(n => blockFolderNames.indexOf(n) === 0);
    if (notAllow) {
        throw new Error(`please dont include "${blockFolderNames.join(', ')}" folders`);
    }
    const watcher = chokidar_1.default.watch(wPath);
    watcher.on('ready', () => {
        watcher.on('all', () => {
            Object.keys(require.cache)
                .forEach((id) => {
                const cId = id.replace(reWin, '/');
                if (cId.indexOf(wPath) === 0) {
                    myDebug('=> deleting cache key', id.replace(reWin, '/'));
                    delete require.cache[id];
                }
            });
        });
    });
    return (routerPath) => {
        require(routerPath);
        return (req, res, next) => {
            myDebug('require hot reload');
            require(routerPath)(req, res, next);
        };
    };
};
//# sourceMappingURL=index.js.map