import sinon from 'sinon';

/** @param {ReturnType<import("fastify-plugin")>} routePlugin */
export default (routePlugin, opts = {}, extensions = {}, commonHandlers = {}) => {
  const app = {
    dbExtensions: extensions,
    route: sinon.stub(),
    setErrorHandler: sinon.stub(),
  };

  const options = {
    baseUrl: '/api/vexp',
    commonHandlers,
    ...opts,
  };

  const next = sinon.stub();

  routePlugin(app, options, next);

  return {
    app,
    options,
    next,
    routeStub: app.route,
    setErrorHandlerStub: app.setErrorHandler,
    /** @param {string} method */
    getHandlerByMethod: (method) => app
      .route
      .getCalls()
      .find((cfg) => cfg.args[0].method === method)
      .args[0]
      .handler,
    getHandlerByMethodAndParam: (method, param) => app
      .route
      .getCalls()
      .find((cfg) => cfg.args[0].method === method && cfg.args[0].url.includes(param))
      .args[0]
      .handler,
    /** @param {string} str */
    urlIncludes: (str) => app
      .route
      .getCall(0)
      .args[0]
      .url
      .includes(str),
  };
};
