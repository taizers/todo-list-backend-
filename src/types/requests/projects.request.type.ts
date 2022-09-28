import { Request } from 'express';

export interface UpdateProjectRequest extends Request {
  body: {
    title?: string;
    color?: string;
  };
  params: {
    id: string;
  };
}

export interface SearchProjectRequest extends Request {
  query: {
    query: string;
  };
}
