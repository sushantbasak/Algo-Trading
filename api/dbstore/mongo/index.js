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
  try {
    const result = await User.schema.create(body);

    const final = result.toJSON();

    delete final.password;

    delete final.isEmailConfirmed;

    delete final.isPasswordReset;

    return { result: final, hasError: null };
  } catch (ex) {
    ErrorHandler.extractError(ex);

    return { result: null, hasError: true };
  }
};

const findUser = async (body) => {
  try {
    const result = await User.schema.findOne(body);

    const final = result.toJSON();

    delete final.password;

    return { result: final, hasError: null };
  } catch (ex) {
    ErrorHandler.extractError(ex);

    return { result: null, hasError: true };
  }
};

const getPassword = async (body) => {
  try {
    const { _id, password, isEmailConfirmed } = await User.schema.findOne(body);

    return { result: { _id, password, isEmailConfirmed }, hasError: null };
  } catch (ex) {
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
  } catch (ex) {
    ErrorHandler.extractError(ex);

    return { result: null, hasError: true };
  }
};

const dbStoreHandler = {
  createUser,
  findUser,
  getPassword,
  updateUser,
};

module.exports = dbStoreHandler;
