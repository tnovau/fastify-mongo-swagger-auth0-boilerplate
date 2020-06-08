import chai from 'chai';
import {
  buildBaseQueryDto, buildInsertOneDto, buildIdQueryDto, buildUpsertOneSetDto,
} from '../../src/db-extensions-adapter.js';

describe('DbExtensionsAdapter', () => {
  const { expect } = chai;
  const collectionName = 'some';
  const sampleObjectId = '5e7fcb6eb6f1a909fa4107d8';

  it('should return "BaseQueryDto"', () => {
    const query = {};
    const baseQueryDto = buildBaseQueryDto(collectionName, query);

    expect(baseQueryDto.collectionName).to.equal(collectionName);
    expect(baseQueryDto.query).to.equal(query);
  });

  it('should return "InsertOneDto"', () => {
    const doc = { name: 'some' };

    const insertOneDto = buildInsertOneDto(collectionName, doc);

    expect(insertOneDto.collectionName).to.equal(collectionName);
    expect(insertOneDto.doc).to.equal(doc);
  });

  it('should return "IdQueryDto"', () => {
    const idQueryDto = buildIdQueryDto(collectionName, sampleObjectId);

    expect(idQueryDto.collectionName).to.equal(collectionName);
    expect(idQueryDto.id).to.equal(sampleObjectId);
  });

  it('should return "UpsertOneSetDto"', () => {
    const docToUpdate = {};
    const upsertQueryDto = buildUpsertOneSetDto(collectionName, sampleObjectId, docToUpdate);

    expect(upsertQueryDto.collectionName).to.equal(collectionName);
    expect(upsertQueryDto.id).to.equal(sampleObjectId);
    expect(upsertQueryDto.uploadDto.$set).to.equal(docToUpdate);
  });
});
