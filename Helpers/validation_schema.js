const Joi = require("@hapi/joi");

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required(),
  phone: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

const addNoteSchema = Joi.object({
  title: Joi.string().required(),
  topic_id: Joi.string().required(),
  user_id: Joi.string().required(),
  image: Joi.any(),
});

const updateNoteSchema = Joi.object({
  id: Joi.string().required(),
  topic_id: Joi.string().required(),
  title: Joi.string().required(),
  desc: Joi.string().required(),
  image: Joi.any(),
  cloudinary_id: Joi.string(),
});

module.exports = {
  authSchema,
  loginSchema,
  addNoteSchema,
  updateNoteSchema,
};
