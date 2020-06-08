import fp from 'fastify-plugin';

export default fp((app, _opts, next) => {
  // REGISTER ROUTES HERE
  app.get('/', async () => ({ hello: 'world' }));

  next();
});
