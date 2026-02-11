const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  completed: Joi.boolean().optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  completed: Joi.boolean().optional(),
}).min(1);

module.exports = { createTaskSchema, updateTaskSchema };
