const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

export const HttpStatusCodes = {
  getOk: OK,
  postOk: CREATED,
  putDeleteOk: NO_CONTENT,
  badRequest: BAD_REQUEST,
  notFound: NOT_FOUND,
  internalServerError: INTERNAL_SERVER_ERROR,
};

export default {
  HttpStatusCodes,
};
