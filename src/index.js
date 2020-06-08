import fastify from 'fastify';
import dotenv from 'dotenv';

import { buildApp, start } from './app.js';
import { getConfigByProcess } from './config.js';

dotenv.config();

export default (async () => {
  const {
    DB_URI,
    DB_NAME,
    HOST,
    LOGGER,
    PORT,
    AUTH0_AUDIENCE,
    AUTH0_DOMAIN,
  } = getConfigByProcess(process);

  const app = buildApp(DB_NAME, DB_URI, LOGGER, {
    audience: AUTH0_AUDIENCE,
    domain: AUTH0_DOMAIN,
  }, fastify);
  await start(PORT, HOST)(app);
})();
