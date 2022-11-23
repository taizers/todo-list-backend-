import { Joi, validate } from 'express-validation';

export const createTaskValidation = validate(
  {
    body: Joi.object({
      title: Joi.string().max(256).required(),
      description: Joi.string().max(1024).required(),
      due_date: Joi.date().required(),
      is_completed: Joi.boolean(),
      assigned_to: Joi.string().max(256).allow(null).required(),
      project_id: Joi.string().max(256).required(),
      members: Joi.array().items(Joi.string().max(256)).allow(null),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const updateTaskValidation = validate(
  {
    body: Joi.object({
      title: Joi.string().max(256),
      description: Joi.string().max(1024),
      due_date: Joi.date(),
      is_completed: Joi.boolean(),
      assigned_to: Joi.string().max(256).allow(null),
      project_id: Joi.string().max(256),
      members: Joi.array().items(Joi.string().max(256)).allow(null),
    }),
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const uploadTaskAttachmentValidation = validate(
  {
    body: Joi.object({
      type: Joi.string().max(10).required(),
      task_id: Joi.string().max(256).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);
