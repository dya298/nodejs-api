const Joi = require("@hapi/joi");

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  authSchema,
  loginSchema
};
