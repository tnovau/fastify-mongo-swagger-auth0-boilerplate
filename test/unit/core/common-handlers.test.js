import chai from 'chai';
import sinon from 'sinon';

import { HttpStatusCodes } from '../../../src/constants.js';
import { commonHandlers } from '../../../src/feature/core/index.js';

describe('[CommonHandlers]', () => {
  const { expect } = chai;

  const getReply = () => ({
    status: sinon.stub(),
  });

  describe('handleCommonGetOne', () => {
    const { handleCommonGetOne } = commonHandlers;

    it('should handle getOne with result', () => {
      const result = {};

      const handleResult = handleCommonGetOne(result, {});

      expect(handleResult).to.equal(result);
    });

    it('should handle getOne without result', () => {
      const result = null;
      const reply = getReply();

      const handleResult = handleCommonGetOne(result, reply);

      expect(handleResult).to.equal(null);
      expect(reply.status.calledWith(HttpStatusCodes.notFound)).to.equal(true);
    });
  });

  describe('handleCommonPostOne', () => {
    const { handleCommonPostOne } = commonHandlers;

    it('should handle postOne with result', () => {
      const insertedId = 'something';
      const reply = getReply();

      const handleResult = handleCommonPostOne(insertedId, reply);

      expect(handleResult.insertedId).to.equal(insertedId);
      expect(reply.status.calledWith(HttpStatusCodes.postOk)).to.equal(true);
    });
  });

  describe('handleCommonPutDelete', () => {
    const { handleCommonPutDelete } = commonHandlers;

    it('should handle put or delete with result', () => {
      const updateResult = { value: 1 };
      const reply = getReply();

      const handleResult = handleCommonPutDelete(updateResult, reply);

      expect(handleResult).to.equal(null);
      expect(reply.status.calledWith(HttpStatusCodes.putDeleteOk)).to.equal(true);
    });

    it('should handle put or delete without result', () => {
      const updateResult = { value: 0 };
      const reply = getReply();

      const handleResult = handleCommonPutDelete(updateResult, reply);

      expect(handleResult).to.equal(null);
      expect(reply.status.calledWith(HttpStatusCodes.notFound)).to.equal(true);
    });
  });
});
