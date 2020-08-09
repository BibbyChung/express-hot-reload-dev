import { NextFunction, Router } from 'express';
import { IncomingMessage, ServerResponse, STATUS_CODES } from "http";

type handleType = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => void | Promise<void>;

export abstract class BaseRouter {

  public router: Router;

  constructor(
    protected basePath: string,
    protected app?,
  ) {
    this.router = Router();
  }

  abstract init(): void;

  protected send(res: ServerResponse, code = 200, data: string | Buffer | any = '', headers = {}) {

    const TYPE = 'content-type';
    const OSTREAM = 'application/octet-stream';

    let k, obj = {};
    for (k in headers) {
      obj[k.toLowerCase()] = headers[k];
    }

    let type = obj[TYPE] || res.getHeader(TYPE);

    if (!!data && typeof data.pipe === 'function') {
      res.setHeader(TYPE, type || OSTREAM);
      return data.pipe(res);
    }

    if (data instanceof Buffer) {
      type = type || OSTREAM; // prefer given
    } else if (typeof data === 'object') {
      data = JSON.stringify(data);
      type = type || 'application/json;charset=utf-8';
    } else {
      data = data || STATUS_CODES[code];
    }

    obj[TYPE] = type || 'text/plain';
    obj['content-length'] = Buffer.byteLength(data);

    res.writeHead(code, obj);
    res.end(data);
  }

  get(path: string, ...handlers: handleType[]) {
    handlers.forEach(h =>
      this.router.get(`${this.basePath}${path}`, (req, res, next) =>
        this.catchAsyncErrors(req, res, next, (cReq, cRes, cNext) =>
          h(cReq, cRes, cNext)
        )
      )
    );
  }

  post(path: string, ...handlers: handleType[]) {
    handlers.forEach(h =>
      this.router.post(`${this.basePath}${path}`, (req, res, next) =>
        this.catchAsyncErrors(req, res, next, (cReq, cRes, cNext) =>
          h(cReq, cRes, cNext)
        )
      )
    );
  }

  put(path: string, ...handlers: handleType[]) {
    handlers.forEach(h =>
      this.router.put(`${this.basePath}${path}`, (req, res, next) =>
        this.catchAsyncErrors(req, res, next, (cReq, cRes, cNext) =>
          h(cReq, cRes, cNext))
      )
    );
  }

  delete(path: string, ...handlers: handleType[]) {
    handlers.forEach(h =>
      this.router.delete(`${this.basePath}${path}`, (req, res, next) =>
        this.catchAsyncErrors(req, res, next, (cReq, cRes, cNext) =>
          h(cReq, cRes, cNext)
        )
      )
    );
  }

  private async catchAsyncErrors(
    req: IncomingMessage,
    res: ServerResponse,
    next: NextFunction,
    fn: handleType
  ): Promise<void> {
    // http://madole.xyz/error-handling-in-express-with-async-await-routes/
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  protected plus(v: number) {
    return v + 2;
  }

}

export const exportAdapter = <T extends BaseRouter>(type: { new(): T; }) => {
  const obj = new type();
  obj.init();
  return obj.router;
}
