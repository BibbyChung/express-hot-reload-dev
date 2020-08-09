"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotReload = void 0;
const debug_1 = __importDefault(require("debug"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const debug = debug_1.default('express-hot-reload');
String.prototype.toFolder = function () {
    const that = this.toString();
    return path_1.default.join(that, '/');
};
exports.hotReload = (watchFolder, isDebug = false) => {
    debug.enabled = isDebug;
    const reWin = new RegExp('\\' + path_1.default.sep, 'g');
    let wPath = watchFolder;
    const isFolderDirExisted = fs_1.default.existsSync(wPath) && fs_1.default.lstatSync(wPath).isDirectory();
    if (isFolderDirExisted) {
        wPath = wPath.replace(reWin, '/').toFolder();
    }
    else {
        wPath = path_1.default.dirname(wPath).replace(reWin, '/').toFolder();
    }
    debug('watch folder', wPath);
    const watcher = chokidar_1.default.watch(wPath);
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
            });
        });
    });
    return (routerPath) => {
        require(routerPath);
        return (req, res, next) => {
            debug('require hot reload');
            require(routerPath)(req, res, next);
        };
    };
};
//# sourceMappingURL=index.js.map