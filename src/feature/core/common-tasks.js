import {
  buildBaseQueryDto,
  buildIdQueryDto,
  buildInsertOneDto,
  buildUpsertOneSetDto,
  buildProjectedGetAllQueryDto,
} from '../../db-extensions-adapter.js';

/**
 * @param {import('../../../types/db-extensions').DbExtensions} dbExtensions
 * @param {string} collectionName
 */
export default (dbExtensions, collectionName) => {
  const find = () => dbExtensions.findAllInCollection(buildBaseQueryDto(collectionName));

  const findAndProject = (projection) => dbExtensions
    .findAllInCollectionAndProject(
      buildProjectedGetAllQueryDto(collectionName, projection),
    );

  /** @param {{ id: string }} param1 */
  const findById = ({ id }) => dbExtensions
    .findOneByIdInCollection(buildIdQueryDto(collectionName, id));

  /** @param {*} doc */
  const insertOne = (doc) => dbExtensions
    .insertOneInCollectionAndReturnId(buildInsertOneDto(collectionName, doc));

  /**
   * @param {{ id: string }} param1
   * @param {*} doc
   * @param {{ isPush: boolean, isPull: boolean }} param3
   */
  const updateOne = ({
    id, ...query
  },
  doc,
  { isPush, isPull } = { isPush: false, isPull: false }) => dbExtensions
    .updateOneInCollection(buildUpsertOneSetDto(collectionName, id, doc, query, isPush, isPull));

  /**
   * @param {{ id: string }} param1
   */
  const deleteOne = ({ id }) => dbExtensions
    .deleteOneInCollection(buildIdQueryDto(collectionName, id));

  return {
    find,
    findById,
    findAndProject,
    insertOne,
    updateOne,
    deleteOne,
  };
};
