import { HttpStatusCodes } from '../../constants.js';

/**
 * @param {import('mongodb').FindAndModifyWriteOpResultObject} result
 * @param {import('fastify').FastifyReply} reply
 */
const handleCommonPutDelete = (result, reply) => {
  const status = result.value ? HttpStatusCodes.putDeleteOk : HttpStatusCodes.notFound;
  reply.status(status);
  return null;
};

/**
 * @param {*} result
 * @param {import('fastify').FastifyReply} reply
 */
const handleCommonGetOne = (result, reply) => {
  if (result) return result;
  reply.status(HttpStatusCodes.notFound);
  return null;
};

/**
 * @param {string} insertedId
 * @param {import('fastify').FastifyReply} reply
 */
const handleCommonPostOne = (insertedId, reply) => {
  reply.status(HttpStatusCodes.postOk);
  return { insertedId };
};

/**
 * @param {string} insertedId
 * @param {import('fastify').FastifyReply} reply
 */
const handleInvalidObjectId = (id, reply) => {
  reply.status(HttpStatusCodes.badRequest);
  return {
    error: `${id} is not valid.`,
  };
};

export default {
  handleCommonGetOne,
  handleCommonPostOne,
  handleCommonPutDelete,
  handleInvalidObjectId,
};
