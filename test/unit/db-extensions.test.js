import fastify from 'fastify';
import chai from 'chai';
import sinon from 'sinon';
import mongoDb from 'mongodb';
import dbExtensions from '../../src/db-extensions.js';
import {
  buildBaseQueryDto, buildInsertOneDto, buildIdQueryDto, buildUpsertOneSetDto,
} from '../../src/db-extensions-adapter.js';

describe('dbExtensions', () => {
  const { expect } = chai;
  /** @type {import('fastify').FastifyInstance} */
  let app;
  const idToResolve = new mongoDb.ObjectID();
  const findOneAndDelete = sinon.stub().resolves();
  const findOneAndUpdate = sinon.stub().resolves();

  const getApp = async (findOne) => {
    const myApp = fastify();
    const toArray = sinon.stub().resolves([
      {
        _id: idToResolve,
      },
    ]);
    myApp.decorate('db', {
      collection: () => ({
        insertOne: sinon.stub().resolves({ insertedId: idToResolve }),
        find: sinon.stub().returns({
          toArray,
        }),
        findOne,
        findOneAndUpdate,
        findOneAndDelete,
      }),
    });
    myApp.register(dbExtensions);
    await myApp.ready();
    return myApp;
  };

  beforeEach(async () => {
    const findOne = sinon.stub()
      .onFirstCall().resolves({
        _id: idToResolve,
      });
    app = await getApp(findOne);
  });

  afterEach(() => {
    app.close();
  });

  it('should decorate app "dbExtensions"', async () => {
    expect(app.dbExtensions).to.be.an('object');
    expect(app.dbExtensions.insertOneInCollectionAndReturnId).to.be.an('function');
  });

  it('should handle "insertOneInCollectionAndReturnId"', async () => {
    const id = await app.dbExtensions.insertOneInCollectionAndReturnId(buildInsertOneDto('some-collection', {}));

    expect(id).to.equal(idToResolve.toHexString());
  });

  it('should handle "findAllInCollection', async () => {
    const elements = await app.dbExtensions.findAllInCollection(buildBaseQueryDto('collectionName'));

    expect(elements.length).to.equal(1);
    expect(elements[0].id).to.be.an('string');
  });

  it('should handle "findOneByIdInCollection"', async () => {
    const element = await app.dbExtensions.findOneByIdInCollection(
      buildIdQueryDto('collectionName', '5e7fcb6eb6f1a909fa4107d8'),
    );

    expect(element.id).to.equal(idToResolve.toHexString());
  });

  it('should handle "findOneByIdInCollection" when not found', async () => {
    const myApp = await getApp(sinon.stub().resolves());

    const element = await myApp.dbExtensions.findOneByIdInCollection(
      buildIdQueryDto('collectionName', '5e7fcb6eb6f1a909fa4107d7'),
    );

    expect(element).to.equal(null);
    myApp.close();
  });

  it('should handle "updateOneInCollection"', async () => {
    const id = '5e7fcb6eb6f1a909fa4107d8';
    const updateOneSetDto = buildUpsertOneSetDto('collectionName', id, {});
    await app.dbExtensions.updateOneInCollection(updateOneSetDto);
    const { _id } = findOneAndUpdate.firstCall.args[0];
    expect(_id.toHexString()).to.equal(id);
    expect(findOneAndUpdate.firstCall.args[1]).to.equal(updateOneSetDto.uploadDto);
  });

  it('should handle "deleteOneInCollection"', async () => {
    const idQueryDto = buildIdQueryDto('collectionName', '5e7fcb6eb6f1a909fa4107d8');
    await app.dbExtensions.deleteOneInCollection(idQueryDto);
    const { _id } = findOneAndUpdate.firstCall.args[0];
    expect(_id.toHexString()).to.equal(idQueryDto.id);
  });
});
