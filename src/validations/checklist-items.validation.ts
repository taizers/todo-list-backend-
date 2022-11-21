import { Joi, validate } from 'express-validation';

export const createChecklistItemValidation = validate(
  {
    body: Joi.object({
      content: Joi.string().max(512).required(),
      is_completed: Joi.boolean().required(),
      checklist_id: Joi.string().max(256).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const deleteChecklistItemsValidation = validate(
  {
    body: Joi.object({
      items: Joi.array().items(Joi.string().max(256)).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);
