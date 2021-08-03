const validator = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;
const { ENUM } = require('../constants');

const expressValidator = function (app) {
  function hasNoSpaces(value) {
    if (value) {
      if (value.indexOf(' ') < 0) {
        return true;
      }
    }
    return false;
  }

  function isObjectID(value) {
    return ObjectId.isValid(value);
  }

  function areMongoIds(values) {
    let isAnyInvalid = true;
    if (typeof values == 'string') {
      values.split(',').forEach(function (value) {
        if (!isObjectID(value)) {
          isAnyInvalid = false;
        }
      });
    } else if (values instanceof Array) {
      values.forEach(function (value) {
        if (!isObjectID(value)) {
          isAnyInvalid = false;
        }
      });
    } else {
      return false;
    }
    return isAnyInvalid;
  }

  function isObjectIDs(values) {
    let isAnyInvalid = true;
    if (typeof values == 'string') {
      try {
        values = JSON.parse(values);
      } catch (e) {
        return false;
      }
    }
    if (values instanceof Array) {
      values.forEach(function (value) {
        if (!isObjectID(value)) {
          isAnyInvalid = false;
        }
      });
    } else {
      return false;
    }
    return isAnyInvalid;
  }

  function matchesRegex(value, regex) {
    if (value) {
      if (value.length) {
        if (!value.match(regex)) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    } else {
      return true;
    }
  }

  function isNumber(value) {
    return !isNaN(parseInt(value));
  }

  function ifNotEmptyIsNumber(value) {
    if (value) {
      return !isNaN(parseInt(value));
    } else {
      return true;
    }
  }

  function minLength(value) {
    return value.length >= 5;
  }

  function isValidLength(data, requiredLength) {
    return data && data.length === requiredLength;
  }

  function isValidMonth(month) {
    return Number(month) >= 1 && Number(month) <= 12;
  }

  function validReturnExplanationLength(explanation) {
    return explanation.length <= 200;
  }

  function isBoolean(value) {
    return (
      value === true || value === false || value === 'true' || value === 'false'
    );
  }

  app.use(
    validator({
      customValidators: {
        hasNoSpaces: hasNoSpaces,
        isObjectID: isObjectID,
        isObjectIDs: isObjectIDs,
        areMongoIds: areMongoIds,
        matchesRegex: matchesRegex,
        isNumber: isNumber,
        ifNotEmptyIsNumber: ifNotEmptyIsNumber,
        minLength: minLength,
        isValidLength: isValidLength,
        isValidMonth: isValidMonth,
        validReturnExplanationLength: validReturnExplanationLength,
        checkBooleanString: isBoolean,
      },
    })
  );
};

module.exports = expressValidator;
