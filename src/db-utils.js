import mongoDb from 'mongodb';

export const isInvalidMongoId = (id) => !mongoDb.ObjectID.isValid(id);

/** @param {import('mongodb').ObjectID} id */
export const getMongoIdAsString = (id) => id.toHexString();
