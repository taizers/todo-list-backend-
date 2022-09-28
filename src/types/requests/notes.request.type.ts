import { Request } from 'express';

export interface UpdateNoteRequest extends Request {
  body: {
    description?: string;
    color?: string;
    is_completed?: boolean;
  };
  params: {
    id: string;
  };
}
