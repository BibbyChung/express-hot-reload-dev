import { createSandbox, SinonSandbox, SinonAssert } from "sinon";
import { hotReload } from "../../index";

const dir = __dirname;

describe('*** running include node_modules folder test ***', () => {

  let sandbox: SinonSandbox;
  let assert: SinonAssert;

  let server;
  let ss;

  before(() => {

  });

  after(() => {
  });

  beforeEach(() => {
    sandbox = createSandbox();
    assert = sandbox.assert;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test "include node_module" to throw exception', () => {

    try {
      hotReload(`${dir}/../../../`, true)
    } catch (err) {
      assert.match(err.message, 'please dont include "node_modules" folders')
    }

  });

});
