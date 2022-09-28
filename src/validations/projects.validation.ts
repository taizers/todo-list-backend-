import { Joi, validate } from 'express-validation';
import { colorTemplate } from '../helpers/regex';

export const createProjectValidation = validate(
  {
    body: Joi.object({
      title: Joi.string().max(32).required(),
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

export const updateProjectValidation = validate(
  {
    body: Joi.object({
      title: Joi.string().max(32),
      color: Joi.string().pattern(colorTemplate).max(7),
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

export const searchValidation = validate(
  {
    query: Joi.object({
      query: Joi.string().trim().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);
