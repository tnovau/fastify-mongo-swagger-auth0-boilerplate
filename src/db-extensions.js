import andThen from 'ramda/src/andThen.js';
import pipe from 'ramda/src/pipe.js';
import fp from 'fastify-plugin';
import mongoDb from 'mongodb';
import { getMongoIdAsString } from './db-utils.js';

export default fp((app, _opts, next) => {
  /** @returns {import('mongodb').Db} */
  const getDb = () => app.db;

  const getCollectionByName = (collectionName) => getDb()
    .collection(collectionName);

  /** @param {import('../types/db-extensions').InsertOneDto} param0 */
  const insertOneInCollection = ({
    collectionName,
    doc,
  }) => getCollectionByName(collectionName).insertOne(doc);

  /** @param {{ insertedId: import('mongodb').ObjectID }} param0 */
  const getInsertedIdByResult = ({ insertedId }) => getMongoIdAsString(insertedId);

  const insertOneInCollectionAndReturnId = pipe(
    insertOneInCollection,
    andThen(getInsertedIdByResult),
  );

  /** @param {import('../types/db-extensions').BaseQueryDto} param0 */
  const findAllAsArray = ({ collectionName, query }) => getCollectionByName(collectionName)
    .find(query)
    .toArray();

  const findAllAsArrayAndProject = ({ collectionName, projection }) => getCollectionByName(
    collectionName,
  ).find({}, {
    projection,
  })
    .toArray();

  /** @param {{ _id: import('mongodb').ObjectID }} param0 */
  const replaceId = ({ _id, ...doc }) => ({
    id: getMongoIdAsString(_id),
    ...doc,
  });

  const mapMongoDocumentIds = (docs) => docs.map(replaceId);

  const findAllInCollectionAndProject = pipe(
    findAllAsArrayAndProject,
    andThen(mapMongoDocumentIds),
  );

  const findAllInCollection = pipe(
    findAllAsArray,
    andThen(mapMongoDocumentIds),
  );

  /** @param {string} id */
  const getObjectId = (id) => (new mongoDb.ObjectID(id));
  const getObjectIdSelector = (id) => ({ _id: getObjectId(id) });

  /** @param {import('../types/db-extensions').IdQueryDto} param0 */
  const findById = ({ collectionName, id }) => getCollectionByName(collectionName)
    .findOne(
      getObjectIdSelector(id),
    );

  const handleFindById = (doc) => (doc
    ? replaceId(doc)
    : null);

  const findOneByIdInCollection = pipe(
    findById,
    andThen(handleFindById),
  );

  /** @param {import('../types/db-extensions').UpsertOneSetDto} param0 */
  const updateOneInCollection = ({
    id,
    uploadDto,
    collectionName,
    query = {},
  }) => getCollectionByName(collectionName)
    .findOneAndUpdate({
      ...getObjectIdSelector(id),
      ...query,
    }, uploadDto);

  /** @param {import('../types/db-extensions').IdQueryDto} param0 */
  const deleteOneInCollection = ({ id, collectionName }) => getCollectionByName(collectionName)
    .findOneAndDelete(getObjectIdSelector(id));

  app.decorate('dbExtensions', {
    deleteOneInCollection,
    findAllInCollection,
    findAllInCollectionAndProject,
    findOneByIdInCollection,
    insertOneInCollectionAndReturnId,
    updateOneInCollection,
  });

  next();
});
