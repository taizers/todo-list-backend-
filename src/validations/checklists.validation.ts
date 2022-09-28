import { Joi, validate } from 'express-validation';
import { colorTemplate } from '../helpers/regex';

export const createChecklistValidation = validate(
  {
    body: Joi.object({
      title: Joi.string().max(256).required(),
      color: Joi.string().pattern(colorTemplate).max(7).required(),
      items: Joi.array()
        .items(
          Joi.object({
            content: Joi.string().max(512).required(),
            is_completed: Joi.boolean().required(),
          })
        )
        .allow(null),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const updateChecklistValidation = validate(
  {
    body: Joi.object({
      title: Joi.string().max(256),
      color: Joi.string().pattern(colorTemplate).max(7),
      items: Joi.array()
        .items(
          Joi.object({
            id: Joi.number().allow(null).required(),
            content: Joi.string().max(512).required(),
            is_completed: Joi.boolean().required(),
          })
        )
        .allow(null),
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
