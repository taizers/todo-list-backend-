import { Request } from 'express';

export interface UpdateChecklistRequest extends Request {
  body: {
    title?: string;
    color?: string;
    items: Array<{
      id: number | null;
      content: string;
      is_completed: boolean;
    }> | null;
  };
  params: {
    id: string;
  };
}
