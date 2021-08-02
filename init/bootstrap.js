const { MESSAGES } = require('../constants');
const httpCodes = require('http-status-codes');

/**
 * create's custom function on request and response object
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {object} next - next middle ware object
 */
const apiResponseGenerator = (req, res, next) => {
  /**
   * sends response based on parameters
   * @param {object} dataObj - data to be sent in response
   * @param {object} headers - header object
   * @param {number} status - status of response
   */
  const sendResponse = (
    dataObj,
    headers,
    status = httpCodes.StatusCodes.SUCCESS
  ) => {
    headers = headers || { 'Content-Type': 'application/json' };
    res.writeHead(status, headers);
    res.end(JSON.stringify(dataObj));
  };
  /**
   * sends response based on parameters(Error in processing)
   * @param {number} status - status of response
   * @param {string} message - message to be sent in response
   * @param {object} data - data to be sent in response
   * @param {string} code - custom code to be sent in response
   * @param {object} headers - header object
   */
  res.sendError = (status, message = MESSAGES.api.SERVER_ERROR, headers) => {
    const response = {
      success: false,
      message,
      data: {},
    };
    console.error({ method: req.method, response });
    sendResponse(response, headers, status);
  };

  /**
   * sends response based on parameters(Error Validations)
   * @param {object} data - data to be sent in response
   * @param {object} headers - header object
   */
  res.sendValidationError = (message, headers) => {
    console.warn({
      method: req.method,
      response: { code: httpCodes.StatusCodes.VALIDATION_ERROR },
    });
    res.sendError(httpCodes.StatusCodes.BAD_REQUEST, message, headers);
  };

  /**
   * sends response based on parameters(Success in processinh)
   * @param {number} status - status of response
   * @param {string} payload - data to be sent in response
   * @param {object} message - message to be sent in response
   * @param {string} code - custom code to be sent in response
   * @param {object} headers - header object
   */
  res.sendSuccess = (
    payload,
    message,
    status = httpCodes.StatusCodes.OK,
    headers
  ) => {
    const response = {
      success: true,
      data: payload,
      message: message || MESSAGES.api.SUCCESS,
    };
    console.info({
      method: req.method,
      response: JSON.parse(JSON.stringify(response)),
    });
    sendResponse(response, headers, status);
  };
  next();
};

module.exports = {
  apiResponseGenerator,
};
