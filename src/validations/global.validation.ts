import { Joi, validate } from 'express-validation';

export const paramsIdValidation = validate(
  {
    params: Joi.object({
      id: Joi.string().max(256).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);
