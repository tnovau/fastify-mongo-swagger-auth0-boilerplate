/**
 * @param {string} collectionName
 * @param {any} query
 * @returns {import('../types/db-extensions').BaseQueryDto}
 */
const buildBaseQueryDto = (collectionName, query) => ({
  collectionName,
  query,
});

/**
 * @param {string} collectionName
 * @param {string} id
 * @returns {import('../types/db-extensions').IdQueryDto}
 */
const buildIdQueryDto = (collectionName, id) => ({
  ...buildBaseQueryDto(collectionName),
  id,
});

const buildProjectedGetAllQueryDto = (collectionName, projection) => ({
  ...buildBaseQueryDto(collectionName),
  projection,
});

/**
 * @param {string} collectionName
 * @param {*} doc
 * @returns {import('../types/db-extensions').InsertOneDto}
 */
const buildInsertOneDto = (collectionName, doc) => ({
  ...buildBaseQueryDto(collectionName),
  doc,
});

/**
 * @param {boolean} isPush
 * @param {boolean} isPull
 */
const getUploadDtoOperator = (isPush, isPull) => {
  if (isPush) return '$push';
  if (isPull) return '$pull';
  return '$set';
};

/**
 * @param {string} collectionName
 * @param {string} id
 * @param {*} doc
 * @param {*} query
 * @param {boolean} isPush
 * @param {boolean} isPull
 * @returns {import('../types/db-extensions').UpsertOneSetDto}
 */
const buildUpsertOneSetDto = (collectionName, id, doc, query, isPush, isPull) => ({
  ...buildBaseQueryDto(collectionName, query),
  id,
  uploadDto: {
    [getUploadDtoOperator(isPush, isPull)]: doc,
  },
});

export {
  buildBaseQueryDto,
  buildIdQueryDto,
  buildInsertOneDto,
  buildUpsertOneSetDto,
  buildProjectedGetAllQueryDto,
};
