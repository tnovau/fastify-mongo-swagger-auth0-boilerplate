import { FindAndModifyWriteOpResultObject } from "mongodb";

export interface BaseQueryDto {
  collectionName: string;
  query?: any;
}

export interface InsertOneDto<T> extends BaseQueryDto {
  doc: T;
}

export interface UploadDtoSet<T> {
  $set: T;
}

export interface UploadDtoPush<T> {
  $push: T;
}

export interface UpsertOneSetDto<T> extends BaseQueryDto<T> {
  id: string;
  uploadDto: UploadDtoSet<T> | UploadDtoPush<T>;
}

export interface IdQueryDto extends BaseQueryDto {
  id: string;
}

export interface Doc {
  id: string;
}

export interface DbExtensions<T> {
  deleteOneInCollection: (query: IdQueryDto) => Promise<FindAndModifyWriteOpResultObject<any>>;
  findAllInCollection: (query: BaseQueryDto) => Promise<Doc[]>;
  findOneByIdInCollection: (query: IdQueryDto) => Promise<Doc>;
  insertOneInCollectionAndReturnId: (insertOneDto: InsertOneDto<T>) => Promise<string>;
  updateOneInCollection: (updateOneDto: UpsertOneSetDto<T>) => Promise<FindAndModifyWriteOpResultObject<any>>;
}
