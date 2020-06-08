export const ENABLE_LOGGER_CONFIG = 'true';

export const DEFAULTS_CONFIG = {
  DB_URI: 'mongodb://localhost:27017/sample-server',
  DB_NAME: 'sample-server',
  HOST: '0.0.0.0',
  LOGGER: true,
  PORT: '8000',
};

/** @param {NodeJS.Process} param0 */
export const getConfigByProcess = ({
  env: {
    DB_URI,
    DB_NAME,
    HOST,
    LOGGER,
    PORT,
    AUTH0_DOMAIN = '',
    AUTH0_AUDIENCE = '',
  },
}) => ({
  DB_URI: DB_URI || DEFAULTS_CONFIG.DB_URI,
  DB_NAME: DB_NAME || DEFAULTS_CONFIG.DB_NAME,
  HOST: HOST || DEFAULTS_CONFIG.HOST,
  LOGGER: LOGGER === undefined ? DEFAULTS_CONFIG.LOGGER : LOGGER === ENABLE_LOGGER_CONFIG,
  PORT: PORT || DEFAULTS_CONFIG.PORT,
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE,
});
