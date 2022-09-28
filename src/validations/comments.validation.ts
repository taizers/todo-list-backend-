import { Joi, validate } from 'express-validation';

export const createCommentValidation = validate(
  {
    body: Joi.object({
      content: Joi.string().required().max(1024),
      task_id: Joi.number().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const uploadCommentAttachmentValidation = validate(
  {
    body: Joi.object({
      type: Joi.string().max(10).required(),
      comment_id: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);
