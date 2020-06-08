import fastifySwagger from 'fastify-swagger';

/** @param {import('fastify').FastifyInstance} app */
const swagger = (app) => app.register(fastifySwagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Server swagger',
      description: 'Server documentation.',
      version: '0.0.1',
    },
    tags: [
      { name: 'Sample-tag', description: 'Sample endpoints' },
    ],
  },
  exposeRoute: true,
});

export default swagger;
