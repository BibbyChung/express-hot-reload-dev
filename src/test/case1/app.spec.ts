import { createSandbox, SinonSandbox, SinonAssert } from "sinon";
import supertest from 'supertest';
import { TestHelper } from "../testHelper";

const dir = __dirname;

describe('*** running graphql test ***', () => {

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
    // done();

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

  it('test "/api/graphql"', (done) => {

    const url = '/api/graphql';
    const q = 'query  qq {\n  tasks{\n    id\n    name\n    complete\n  }\n}';
    const changedFilePath = `${dir}/graphql/resolvers.js`;
    const shellPath = `${dir}/../../../src/test/script.sh`;

    ss.post(url)
      .send({ query: q })
      .expect(200)
      .expect(res => {
        const obj = res.body.data.tasks[0];
        assert.match(obj.id, 1);
        assert.match(obj.name, 'Go to Market');
      })
      .then(() => TestHelper.cmd([shellPath, 'mk-change', changedFilePath]))
      .then(() => TestHelper.sleep(300))
      .then(() => {
        return ss.post(url)
          .send({ query: q })
          .expect(200)
          .expect(res => {
            const obj = res.body.data.tasks[0];
            assert.match(obj.id, 1);
            assert.match(obj.name, 'Go to Market11');
          });
      })
      .then(() => TestHelper.cmd([shellPath, 'mk-revert', changedFilePath]))
      .then(() => TestHelper.sleep(300))
      .then(() => {
        return ss.post(url)
          .send({ query: q })
          .expect(200)
          .expect(res => {
            const obj = res.body.data.tasks[0];
            assert.match(obj.id, 1);
            assert.match(obj.name, 'Go to Market');
          });
      })
      .then(() => done());

  });

});
