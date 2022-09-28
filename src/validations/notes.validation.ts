import { Joi, validate } from 'express-validation';
import { colorTemplate } from '../helpers/regex';

export const createNoteValidation = validate(
  {
    body: Joi.object({
      description: Joi.string().max(512).required(),
      color: Joi.string().pattern(colorTemplate).max(7).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const updateNoteValidation = validate(
  {
    body: Joi.object({
      description: Joi.string().max(512),
      color: Joi.string().pattern(colorTemplate).max(7),
      is_completed: Joi.boolean(),
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
