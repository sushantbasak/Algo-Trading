'use strict';

const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;
const appSettings = require('../../../config');
const { User } = require('./schemas');
const log = console.log;
const mongoDB = appSettings.mongoDb;

mongoose.connect(
  mongoDB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  () => console.log(`Database Connected on ${mongoDB}`)
);

const createUser = async (body) => {
  // const result = await User.schema.create({ $set: body }, (error, doc) => {
  //   if (error) hasError = error;
  // });

  // return { result: result.toJSON(), hasError };

  try {
    const result = await User.schema.create(body);

    return { result, hasError: null };
  } catch (e) {
    return { result: null, hasError: e };
  }
};

const findUser = async (body) => {
  try {
    const result = await User.schema.findOne(body);

    // Case 1 :- In this case password is not deleted
    // console.log(typeof result);

    // delete result.password;

    // Case 2 :- Password is deleted when we use toJSON method

    const final = result.toJSON();

    console.log(typeof final);

    delete final.password;

    delete final.isEmailConfirmed;

    return { result: final, hasError: null };
  } catch (e) {
    return { result: null, hasError: true };
  }
};

const saveUser = async (body) => {
  let hasError = false;
  body.updatedAt = +new Date();

  const result = await User.schema.create(
    { id: body.id || uuidv4() },
    { $set: body },
    { upsert: true },
    (error, doc) => {
      if (error) {
        hasError = error;
      }
    }
  );

  return { result: result.toJSON(), hasError };
};

const dbStoreHandler = {
  createUser,
  findUser,
  saveUser,
};

module.exports = dbStoreHandler;
