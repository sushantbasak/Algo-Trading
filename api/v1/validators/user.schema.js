const { Joi } = require('celebrate');

const Pattern =
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';

function createAccountSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().trim().lowercase().required().messages({
      'string.email': 'Email must be a valid email address',
      'string.trim': 'Email may not contain any spaces at the beginning or end',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().pattern(new RegExp(Pattern)).message({
      'string.pattern':
        'Password must be of length (6,30) & AlphaNumeric Characters',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

  const options = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    return res.send({
      error: ` ${error.details.map((x) => x.message).join(', ')}`,
    });
  } else {
    req.body = value;
    next();
  }
}

function loginAccountSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      'string.email': 'Email must be a valid email address',
      'string.trim': 'Email may not contain any spaces at the beginning or end',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().pattern(new RegExp(Pattern)).message({
      'string.pattern.base':
        'Password must be of min length of 8 & must have one lowercase, uppercase, number & special Character ',
    }),
  });

  const options = {
    allowUnknown: false,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    return res.send({
      error: ` ${error.details.map((x) => x.message).join(', ')}`,
    });
  } else {
    req.body = value;

    next();
  }
}

module.exports = { createAccountSchema, loginAccountSchema };
