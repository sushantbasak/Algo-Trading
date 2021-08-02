const { Joi } = require('celebrate');
const saveUserSchema = Joi.object().keys({
  id: Joi.string().allow('').optional(),
  name: Joi.string().when('id', {
    is: null || '',
    then: Joi.string().required(),
    otherwise: Joi.string().allow('').optional(),
  }),
});

module.exports = {
  saveUserSchema,
};
