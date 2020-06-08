import chai from 'chai';
import sinon from 'sinon';
import { commonTasks } from '../../../src/feature/core/index.js';

describe('[CommonTasks]', () => {
  const { expect } = chai;
  const collectionName = 'collectionName';

  describe('insertOne', () => {
    const insertOneInCollectionAndReturnId = sinon.stub().resolves();
    const { insertOne } = commonTasks({ insertOneInCollectionAndReturnId }, collectionName);

    it('should insert one doc in collection', async () => {
      const doc = {};
      await insertOne(doc);

      const dto = insertOneInCollectionAndReturnId.firstCall.args[0];

      expect(dto.doc).to.equal(doc);
    });
  });

  describe('findAll', () => {
    const findAllInCollection = sinon.stub().resolves();
    const { find } = commonTasks({ findAllInCollection }, collectionName);

    it('should find all the docs', async () => {
      await find();

      const dto = findAllInCollection.firstCall.args[0];

      expect(dto.collectionName).to.equal(collectionName);
    });
  });

  describe('findById', () => {
    const findOneByIdInCollection = sinon.stub().resolves();
    const { findById } = commonTasks({ findOneByIdInCollection }, collectionName);

    it('should find one by id', async () => {
      const id = 'some';
      await findById({ id });

      const dto = findOneByIdInCollection.firstCall.args[0];

      expect(dto.id).to.equal(id);
    });
  });

  describe('updateOne', () => {
    it('should call with $push when isPush', () => {
      const updateOneInCollection = sinon.stub();
      const id = 'someId';
      const doc = { entity: {} };
      commonTasks({ updateOneInCollection }, collectionName)
        .updateOne({ id }, doc, { isPush: true });

      expect(updateOneInCollection.calledWithMatch({
        collectionName,
        id,
        uploadDto: {
          $push: doc,
        },
      })).to.equal(true);
    });

    it('should call with $set by default', () => {
      const updateOneInCollection = sinon.stub();
      const id = 'someId';
      const doc = { entity: {} };
      commonTasks({ updateOneInCollection }, collectionName)
        .updateOne({ id }, doc);

      expect(updateOneInCollection.calledWithMatch({
        collectionName,
        id,
        uploadDto: {
          $set: doc,
        },
      })).to.equal(true);
    });
  });
});
