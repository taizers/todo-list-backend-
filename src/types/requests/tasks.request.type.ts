import { Request } from 'express';

export interface UpdateTaskRequest extends Request {
  body: {
    description?: string;
    color?: string;
    is_completed?: boolean;
    title?: string;
    due_date?: Date;
    assigned_to?: string;
    project_id?: string;
    members?: Array<string>;
  };
  params: {
    id: string;
  };
}
