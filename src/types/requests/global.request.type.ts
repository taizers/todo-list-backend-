import { Request } from 'express';

export interface ParamsIdRequest extends Request {
  params: {
    id: string;
  };
}
