'use strict';

const dbStoreHandler = require('../../dbstore/mongo');

const saveUser = async (data) => {
  const { result, hasError } = await dbStoreHandler.saveUser(data);
  if (hasError) {
    return { status: 'ERROR_FOUND' };
  }
  return { result, status: 'USER_SAVED' };
};

const createUser = async (data) => {
  const { result, hasError } = await dbStoreHandler.createUser(data);

  if (hasError) {
    return { status: 'ERROR_FOUND' };
  }
  return { result, status: 'USER_CREATED' };
};

const findUser = async (data) => {
  const { result, hasError } = await dbStoreHandler.findUser(data);

  if (hasError) {
    return { status: 'ERROR_FOUND' };
  }
  return { result, status: 'USER_FOUND' };
};

const getPassword = async (data) => {
  const { result, hasError } = await dbStoreHandler.getPassword(data);

  if (hasError) {
    return { status: 'ERROR_FOUND' };
  }
  return { result, status: 'USER_FOUND' };
};

const updateUser = async (filter, updateData) => {
  const { result, hasError } = await dbStoreHandler.updateUser(
    filter,
    updateData
  );

  if (hasError) {
    return { status: 'ERROR_FOUND' };
  }
  return { result, status: 'USER_UPDATED' };
};

const userService = {
  saveUser,
  createUser,
  findUser,
  getPassword,
  updateUser,
};

module.exports = userService;
