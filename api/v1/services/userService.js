'use strict';

const dbStoreHandler = require('../../dbstore/mongo');

const saveUser = async (data) => {
  const { result, hasError } = await dbStoreHandler.saveUser(data);
  if (hasError) {
    return { status: 'ERROR_FOUND' };
  }
  return { result, status: 'USER_SAVED' };
};

const userService = {
  saveUser,
};

module.exports = userService;
