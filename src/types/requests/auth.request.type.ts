import { Request } from 'express';

export interface signUpRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

export interface loginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface requestWithCookiesToken extends Request {
  cookies: {
    refresh_token: string;
  };
}
