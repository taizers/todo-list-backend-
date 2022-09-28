import { Request } from 'express';

export interface UpdateTaskRequest extends Request {
  body: {
    description?: string;
    color?: string;
    is_completed?: boolean;
    title?: string;
    due_date?: Date;
    assigned_to?: number;
    project_id?: number;
    members?: Array<number>;
  };
  params: {
    id: string;
  };
}
