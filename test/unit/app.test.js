
import chai from 'chai';
import sinon from 'sinon';

import { buildApp, start } from '../../src/app.js';

describe('App', () => {
  const { expect } = chai;

  it('buildApp', () => {
    const appToResolve = {
      register: sinon.stub(),
    };
    const fastify = sinon.stub().returns(appToResolve);
    const shouldUseLogger = true;
    const app = buildApp('', '', shouldUseLogger, fastify);

    expect(app).to.equal(appToResolve);
    expect(fastify.firstCall.args[0].logger).to.equal(shouldUseLogger);
    expect(appToResolve.register.called).to.equal(true);
  });

  it('should start when "listen" resolves', async () => {
    const port = '8000';
    const appArg = {
      listen: sinon.stub().resolves(),
      log: {
        info: sinon.stub(),
      },
      server: {
        address: sinon.stub().returns({ port }),
      },
      swagger: sinon.stub(),
    };
    const app = await start(port, '0.0.0.0')(appArg);

    expect(appArg.log.info.firstCall.args[0]).to.include(port);
    expect(app).to.equal(appArg);
  });

  it('should start when "listen" rejects', async () => {
    const port = '8000';
    const errorMessage = 'SomeErrorMessage';
    const appArg = {
      listen: sinon.stub().rejects(new Error(errorMessage)),
      log: {
        error: sinon.stub(),
      },
    };

    const processExitStub = sinon.stub(process, 'exit');

    await start(port, '0.0.0.0')(appArg);

    expect(appArg.log.error.firstCall.args[0].message).to.equal(errorMessage);
    expect(processExitStub.firstCall.args[0]).to.equal(1);
  });
});
