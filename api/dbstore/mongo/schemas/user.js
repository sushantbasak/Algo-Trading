'use strict';

const mongoose = require('mongoose');
const { COLLECTIONS } = require('../../../../constants');

const userSchema = new mongoose.Schema();

module.exports = {
  schema: mongoose.model(COLLECTIONS.USER, userSchema),
};
