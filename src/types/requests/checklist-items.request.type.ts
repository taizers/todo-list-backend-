import { Request } from 'express';

export interface CreateChecklistItemRequest extends Request {
  body: {
    is_completed: boolean;
    content: string;
    checklist_id: string;
  };
}

export interface DeleteChecklistItemsRequest extends Request {
  body: {
    items: Array<string>;
  };
}
