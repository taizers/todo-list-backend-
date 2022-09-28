import { Request } from 'express';

export interface CreateChecklistItemRequest extends Request {
  body: {
    is_completed: boolean;
    content: string;
    checklist_id: number;
  };
}

export interface DeleteChecklistItemsRequest extends Request {
  body: {
    items: Array<number>;
  };
}
