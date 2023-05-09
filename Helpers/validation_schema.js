const Joi = require("@hapi/joi");

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required(),
  phone: Joi.string()
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required()
});

const addNoteSchema = Joi.object({
  title: Joi.string().required(),
  topic_id: Joi.string().required(),
  user_id: Joi.string().required(),
});

module.exports = {
  authSchema,
  loginSchema,
  addNoteSchema
};
