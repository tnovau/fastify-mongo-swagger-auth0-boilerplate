import fastifyAuth0Verify from 'fastify-auth0-verify';
import cors from 'fastify-cors';
import db from './db.js';
import dbExtensions from './db-extensions.js';
import routes from './routes.js';
import swagger from './swagger.js';


/**
 * @param {string} dbName
 * @param {string} dbUri
 * @param {boolean} shouldUseLogger
 * @param {{
 *  domain: string,
 *  audience: string
 * }} auth
 * @param {import('fastify')} fastify
 */
export const buildApp = (dbName, dbUri, shouldUseLogger, auth, fastify) => {
  const app = fastify({ logger: shouldUseLogger });
  swagger(app);
  app.register(db, {
    dbName,
    dbUri,
    onClose: () => {
      app.log.info('Closing mongodb connection');
    },
  });
  app.register(fastifyAuth0Verify, auth);
  app.register(routes);
  app.register(dbExtensions);
  app.register(cors);

  return app;
};

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {string} port
 * @param {string} host
 */
const handleAppListen = async (app, port, host) => {
  try {
    await app.listen(port, host);
    return { result: true };
  } catch (error) {
    return { result: false, error };
  }
};

/** @param {import('fastify').FastifyInstance} app */
const getAppServerPort = (app) => app.server.address().port;

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {ReturnType<handleAppListen>} appListenResult
 */
const handleServerListenError = (app, appListenResult) => {
  app.log.error(appListenResult.error);
  process.exit(1);
};

/** @param {import('fastify').FastifyInstance} app */
const handleServerListenOk = (app) => {
  app.log.info(`app listing on ${getAppServerPort(app)}`);
  return app;
};

/**
 * @param {string} port
 * @param {string} host
 * @returns {(app: import('fastify').FastifyInstance) =>
 *  Promise<import('fastify').FastifyInstance | never>}
 */
export const start = (port, host) => async (app) => {
  const appListenResult = await handleAppListen(app, port, host);
  if (appListenResult.result) {
    app.swagger();
    return handleServerListenOk(app);
  }
  return handleServerListenError(app, appListenResult);
};
