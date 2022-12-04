import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  createUser,
  login,
  refresh,
  logout,
} from '../services/db/auth.services';
import { customResponse } from '../helpers/responce';
import { findUser } from '../services/db/users.services';
import { createProject } from '../services/db/projects.services';
import {
  signUpRequest,
  loginRequest,
  requestWithCookiesToken,
} from '../types/requests/auth.request.type';
import logger from '../helpers/logger';

const PersonalProject = {
  title: 'Personal',
  color: '#6074F9',
};

export const signUpAction = async (
  req: signUpRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password, username } = req.body;

  logger.info(
    `SignUp Action: { password: ${password}, email: ${email}, username: ${username} }`
  );

  let user;

  try {
    user = await findUser({ email });
  } catch (err) {
    logger.error('SignUp Action - Cannot find user', err);
    next(err);
  }

  if (user) {
    logger.info(`SignUp Action - User already exists ${email}`);
    return customResponse(res, 422, {
      code: 422,
      message: 'User is already registered.',
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    user = await createUser({
      email,
      username,
      password: encryptedPassword,
    });

    await createProject({ ...PersonalProject, owner_id: user.id });

    res.cookie('refresh_token', user.user_session.refresh_token, {
      maxAge: Number(process.env.JWT_REFRESH_MAX_AGE) * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
    });

    return customResponse(res, 201, user);
  } catch (err) {
    logger.error('SignUp Action - Cannot create user', err);
    next(err);
  }
};

export const loginAction = async (
  req: loginRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  logger.info(`Login Action: { email: ${email}, password: ${password} }`);

  try {
    const user_session: any = await login(email, password);

    res.cookie('refresh_token', user_session.refresh_token, {
      maxAge: Number(process.env.JWT_REFRESH_MAX_AGE) * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
    });

    return customResponse(res, 200, user_session);
  } catch (err) {
    logger.error('Login Action - Cannot find user', err);
    next(err);
  }
};

export const refreshAction = async (
  req: requestWithCookiesToken,
  res: Response,
  next: NextFunction
) => {
  const refresh_token = req.cookies.refresh_token;

  logger.info(`Refresh Action: { refresh_token: ${refresh_token} }`);

  try {
    const user_session: any = await refresh(refresh_token);

    res.cookie('refresh_token', user_session.refresh_token, {
      maxAge: Number(process.env.JWT_REFRESH_MAX_AGE) * 1000,
      httpOnly: true,
      secure: false,
    });

    return customResponse(res, 200, user_session);
  } catch (err) {
    logger.error('Refresh Action - Cannot refresh', err);
    next(err);
  }
};

export const logoutAction = async (
  req: requestWithCookiesToken,
  res: Response,
  next: NextFunction
) => {
  const refresh_token = req.cookies.refresh_token;
  logger.info(req.cookies);

  logger.info(`Logout Action: { refresh_token: ${refresh_token} }`);

  try {
    await logout(refresh_token);

    return customResponse(res, 200, { success: true });
  } catch (err) {
    logger.error('Logout Action - Cannot logout', err);
    next(err);
  }
};
