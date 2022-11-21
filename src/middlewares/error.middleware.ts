import { Request, Response, NextFunction } from 'express';
import { customResponse } from '../helpers/responce';

export default (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.status = error.statusCode || error.status || 500;

  let validationMessage;

  if (error?.details) {
    Object.values(error.details)?.forEach((element: any) => {
      if (element[0]?.message) {
        validationMessage = element[0]?.message;
      }
    });
  }

  return customResponse(res, error.status, {
    code: error.status,
    message: validationMessage || error.message,
  });
};
