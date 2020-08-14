import { BaseRouter, exportAdapter } from './baseRouter';
import { userData } from '../services/user.service';
import { IncomingMessage, ServerResponse } from 'http';
import { CacheHelper } from '../common/cacheHelper';

const baseUrl = '/api';

class Router01 extends BaseRouter {
  constructor(
    protected app?,
  ) {
    super(baseUrl, app);
  }

  init() {

    this.get(`/user`, async (req: IncomingMessage, res: ServerResponse) =>  this.getUser(req, res));
    this.get(`/cache`, async (req: IncomingMessage, res: ServerResponse) => this.getCache(req, res));

  }

  private getUser(req: IncomingMessage, res: ServerResponse): void | PromiseLike<void> {

    this.send(res, 200, {
      name: userData.name + '00',
      age: this.plus(userData.age)
    });

  }

  private async getCache(req: IncomingMessage, res: ServerResponse) {

    const t = await CacheHelper.get('ttt') || 'abc';
    this.send(res, 200, {
      t
    });

  }

}

export = exportAdapter(Router01);
