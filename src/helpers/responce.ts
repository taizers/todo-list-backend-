import { Response } from 'express';

export const customResponse = (res: Response, code: number, data: any) =>
  res.status(code).json({ data });
