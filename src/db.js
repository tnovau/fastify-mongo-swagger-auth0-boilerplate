import fp from 'fastify-plugin';
import mongodb from 'mongodb';

export default fp(
  /**
   * @param {{
   *  dbName: string,
   *  dbUri: string,
   *  onClose: import('mongodb').MongoCallback<void>
   * }} opts
   */
  (app, opts, next) => {
    const {
      dbName,
      dbUri,
      onClose,
    } = opts;

    const connect = () => {
      const dbClient = new mongodb.MongoClient(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      return dbClient.connect();
    };

    const getClient = async () => {
      try {
        const dbClient = await connect(dbUri);
        return dbClient;
      } catch (error) {
        app.log.error(error);
        throw error;
      }
    };

    if (process.env.NODE_ENV === 'test') {
      app.addHook('onClose', onClose);
      app.decorate('db', {});
      next();
    } else {
      getClient()
        .then((client) => {
          const db = client.db(dbName);

          app.addHook('onClose', () => client.close(onClose));
          app.decorate('db', db);

          next();
        });
    }
  },
);
