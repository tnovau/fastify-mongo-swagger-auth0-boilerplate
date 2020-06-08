import chai from 'chai';
import sinon from 'sinon';

import routes from '../../src/routes.js';

describe('Routes', () => {
  const { expect } = chai;
  it('should set all the routes to the app', () => {
    const get = sinon.stub();
    const register = sinon.stub();
    const next = sinon.stub();
    routes({
      get,
      register,
    }, null, next);

    expect(next.calledOnce).to.equal(true);
    expect(get.called).to.equal(true);
    expect(register.called).to.equal(true);
  });
});
