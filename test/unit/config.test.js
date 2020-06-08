
import chai from 'chai';
import {
  DEFAULTS_CONFIG,
  ENABLE_LOGGER_CONFIG,
  getConfigByProcess,
} from '../../src/config.js';

const buildProcessMock = (DB_URI, DB_NAME, HOST, LOGGER, PORT) => ({
  env: {
    DB_URI, DB_NAME, HOST, LOGGER, PORT,
  },
});

const TEST_DB_NAME = 'dbName';
const TEST_DB_URI = 'dbUri';
const TEST_HOST = '127.0.0.1';
const TEST_LOGGER_DISABLED = 'false';
const TEST_PORT = '443';


describe('Config', () => {
  describe('getConfigByProcess', () => {
    const { expect } = chai;

    const assertConfigResult = ({
      DB_NAME, DB_URI, HOST, LOGGER, PORT,
    }, expected) => {
      expect(DB_NAME).to.equal(expected.DB_NAME);
      expect(DB_URI).to.equal(expected.DB_URI);
      expect(HOST).to.equal(expected.HOST);
      expect(PORT).to.equal(expected.PORT);
      expect(LOGGER).to.equal(expected.LOGGER);
    };

    const testCases = [
      ['should return default values if "process.env" is empty.', [], () => DEFAULTS_CONFIG],
      ['should parse ans return "process.env" configs.', [
        TEST_DB_NAME, TEST_DB_URI, TEST_HOST, ENABLE_LOGGER_CONFIG, TEST_PORT,
      ], (env) => ({ ...env, LOGGER: true })],
      ['should mark "LOGGER" as false if the "process.env" indicates that.', [
        TEST_DB_NAME, TEST_DB_URI, TEST_HOST, TEST_LOGGER_DISABLED, TEST_PORT,
      ], (env) => ({ ...env, LOGGER: false })],
    ];

    testCases.forEach(([text, params, compareFn]) => {
      it(text, () => {
        const processMock = buildProcessMock(...params);
        const config = getConfigByProcess(processMock);
        const { env } = processMock;
        assertConfigResult(config, compareFn(env));
      });
    });
  });
});
