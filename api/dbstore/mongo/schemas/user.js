'use strict';

const mongoose = require('mongoose');
const { COLLECTIONS } = require('../../../../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    // required: [true, 'Please add an email'],
    // unique: true,
    // match: [
    //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //   'Please add a valid email',
    // ],
  },
  role: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    // required: [true, 'Please add a password'],
  },
  resetPasswordToken: String,
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  schema: mongoose.model(COLLECTIONS.USER, userSchema),
};
