interface ICacheType<T> {
  timestamp: number;
  obj: T;
}

export class CacheHelper {

  private static _obj = {};

  static init() {
  }

  static async set<T>(key: string, obj: T) {
    if (obj === null || obj === undefined) {
      return
    }
    const str = JSON.stringify(obj);
    await new Promise<void>((resolve, reject) => {
      this._obj[key] = str;
      resolve();
    });
  }

  static async get<T>(key: string) {
    const str = await new Promise<string>((resolve, reject) => {
      const str = this._obj[key];
      resolve(str);
    });
    if (!str) {
      return null;
    }
    return JSON.parse(str) as T;
  }

}
