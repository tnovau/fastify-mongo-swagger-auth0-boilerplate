import fastify from 'fastify';
import chai from 'chai';
import { buildApp } from '../../src/app.js';
import { HttpStatusCodes } from '../../src/constants.js';

describe('Hello world', () => {
  const { expect } = chai;

  /** @type {import('fastify').FastifyInstance} */
  let app;
  before(() => {
    app = buildApp('', '', false, fastify);
  });

  after(() => {
    app.close();
  });

  it('should return an object', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).to.equal(HttpStatusCodes.getOk);
    expect(JSON.parse(response.payload).hello).to.equal('world');
  });
});
