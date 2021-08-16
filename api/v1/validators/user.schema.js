const { Joi } = require('celebrate');

const Pattern =
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';

const userSchema = Joi.object().keys({
  mode: Joi.string().allow('').default(1),
  name: Joi.string().when('mode', {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('').optional(),
  }),
  email: Joi.string().when('mode', {
    is: 1,
    then: Joi.string().email().trim().lowercase().required(),
    otherwise: Joi.string().allow('').optional(),
  }),
  password: Joi.string().when('mode', {
    is: 1,
    then: Joi.string().pattern(new RegExp(Pattern)),
    otherwise: Joi.string().allow('').optional(),
  }),
  confirmPassword: Joi.string().when('password', {
    then: Joi.string().valid(Joi.ref('password')).required(),
    otherwise: Joi.string().allow('').optional(),
  }),
});

module.exports = { userSchema };
