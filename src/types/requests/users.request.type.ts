import { Request } from 'express';

export interface SearchMembersRequest extends Request {
  query: {
    query: string;
  };
}
