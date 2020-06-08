import { HttpStatusCodes } from '../../constants.js';

const idField = 'id';
const getItemResponse = (itemType) => ({ type: 'object', properties: itemType });
const getArrayResponse = (itemType) => ({ type: 'array', items: getItemResponse(itemType) });
const getByIdParams = (additionalProps = {}) => ({
  type: 'object',
  properties: {
    [idField]: { type: 'string' },
    ...additionalProps,
  },
});
const getEmptyResponse = () => ({
  type: 'null',
});

const getPutDeleteResponses = () => ({
  [HttpStatusCodes.putDeleteOk]: getEmptyResponse(),
  [HttpStatusCodes.notFound]: getEmptyResponse(),
});

/**
 * @param {{ swaggerTag: string, itemType: any }} param0
 * @returns {import("fastify").RouteSchema}
 */
const makeGetJsonSchema = ({ itemType, swaggerTag }, isArray = false) => ({
  tags: [swaggerTag],
  params: isArray ? undefined : getByIdParams(),
  response: {
    [HttpStatusCodes.getOk]: isArray
      ? getArrayResponse(itemType)
      : getItemResponse(itemType),
    [HttpStatusCodes.notFound]: getEmptyResponse(),
  },
});

/**
 * @param {{ itemType: any, required: string[], swaggerTag: string }} param0
 * @returns {import("fastify").RouteSchema}
 */
export const makeCreateJsonSchema = ({
  itemType,
  required,
  swaggerTag,
  params,
  responses = {},
}) => ({
  tags: [swaggerTag],
  body: { ...getItemResponse(itemType), required },
  response: {
    [HttpStatusCodes.postOk]: {
      type: 'object',
      properties: {
        insertedId: { type: 'string' },
      },
    },
    ...responses,
  },
  params,
});

/** @param {{ swaggerTag: string, itemType: any }} opts */
export const makeGetAllJsonSchema = (opts) => makeGetJsonSchema(opts, true);
/** @param {{ swaggerTag: string, itemType: any }} opts */
export const makeGetOneJsonSchema = (opts) => makeGetJsonSchema(opts);

/**
 * @param {{ itemType: any, required: string[], swaggerTag: string }} param0
 * @returns {import("fastify").RouteSchema}
 */
export const makePutOneJsonSchema = ({
  itemType,
  swaggerTag,
  required,
  params = {},
  paramsRequired = [],
}) => ({
  tags: [swaggerTag],
  params: { ...getByIdParams(params), required: [idField, ...paramsRequired] },
  body: { ...getItemResponse(itemType), required },
  response: getPutDeleteResponses(),
});

/**
 * @param {{ swaggerTag: string, itemType: any }} param0
 * @returns {import("fastify").RouteSchema}
 */
export const makeDeleteJsonSchema = ({
  swaggerTag,
  params = {},
  paramsRequired = [],
}) => ({
  tags: [swaggerTag],
  params: { ...getByIdParams(params), required: [idField, ...paramsRequired] },
  response: getPutDeleteResponses(),
});
