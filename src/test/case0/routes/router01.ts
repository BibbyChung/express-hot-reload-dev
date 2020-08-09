import { BaseRouter, exportAdapter } from './baseRouter';
import { userData } from '../services/user.service';
import { IncomingMessage, ServerResponse } from 'http';

const baseUrl = '/api';

class Router01 extends BaseRouter {
  constructor(
    protected app?,
  ) {
    super(baseUrl, app);
  }

  init() {

    this.get(`/user`, async (req: IncomingMessage, res: ServerResponse) => await this.getUser(req, res));

  }

  private getUser(req: IncomingMessage, res: ServerResponse): void | PromiseLike<void> {

    this.send(res, 200, {
      name: userData.name + '00',
      age: this.plus(userData.age)
    });

  }
}

export = exportAdapter(Router01);
