'use strict';

const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;
const appSettings = require('../../../config');
const { User } = require('./schemas');
const log = console.log;
const ErrorHandler = require('../../utils/errorHandler');
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

    const final = result.toJSON();

    delete final.password;

    delete final.isEmailConfirmed;

    return { result: final, hasError: null };
  } catch (e) {
    ErrorHandler.extractError(ex);

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

    return { result: final, hasError: null };
  } catch (e) {
    ErrorHandler.extractError(ex);

    return { result: null, hasError: true };
  }
};

const getPassword = async (body) => {
  try {
    const { _id, password, isEmailConfirmed } = await User.schema.findOne(body);

    return { result: { _id, password, isEmailConfirmed }, hasError: null };
  } catch (e) {
    ErrorHandler.extractError(ex);

    return { result: null, hasError: true };
  }
};

const updateUser = async (filter, updateData) => {
  try {
    const { _id, name, email } = await User.schema.findOneAndUpdate(
      filter,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return { result: { _id, name, email }, hasError: null };
  } catch (e) {
    ErrorHandler.extractError(ex);

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
  getPassword,
  updateUser,
};

module.exports = dbStoreHandler;
