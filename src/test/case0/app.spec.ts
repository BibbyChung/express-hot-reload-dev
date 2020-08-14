import { createSandbox, SinonSandbox, SinonAssert } from "sinon";
import supertest from 'supertest';
import { TestHelper } from "../testHelper";

const dir = __dirname;

describe('*** running api test ***', () => {

  let sandbox: SinonSandbox;
  let assert: SinonAssert;

  let server;
  let ss;

  before(function (done) {

    // // runs before each test in this block
    this.timeout(60 * 1000);

    // start server
    server = require('./app');
    ss = supertest('http://localhost:3000');
    TestHelper.sleep(300).then(() => done());

  });

  after((done) => {
    server.close(() => done());
  });

  beforeEach(() => {
    sandbox = createSandbox();
    assert = sandbox.assert;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test "/api/user"', (done) => {

    const url = '/api/user';
    const changedFilePath = `${dir}/services/user.service.js`;
    const shellPath = `${dir}/../../../src/test/script.sh`;

    ss.get(url).expect(200)
      .expect(res => {
        const obj: { name: string, age: number } = res.body;
        assert.match(obj.name, 'Bibby00');
        assert.match(obj.age, 20);
      })
      .then(() => TestHelper.cmd([shellPath, 'bc-change', changedFilePath]))
      .then(() => TestHelper.sleep(300))
      .then(() => {
        return ss.get(url)
          .expect(200)
          .expect(res => {
            const obj: { name: string, age: number } = res.body;
            assert.match(obj.name, 'BibbyChung00');
            assert.match(obj.age, 20);
          });
      })
      .then(() => TestHelper.cmd([shellPath, 'bc-revert', changedFilePath]))
      .then(() => TestHelper.sleep(300))
      .then(() => {
        return ss.get(url)
          .expect(200)
          .expect(res => {
            const obj: { name: string, age: number } = res.body;
            assert.match(obj.name, 'Bibby00');
            assert.match(obj.age, 20);
          });
      })
      .then(() => done());

  });

  it('test "/api/cache"', (done) => {

    const url = '/api/cache';

    ss.get(url).expect(200)
      .expect(res => {
        const obj: { t: string } = res.body;
        console.log(obj);
        assert.match(obj.t, 'abc');
      })
      .then(() => done());

  });

});
