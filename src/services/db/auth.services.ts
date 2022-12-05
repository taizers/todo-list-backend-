// eslint-disable-next-line @typescript-eslint/no-var-requires
const { User } = require('../../db/models/index');

import {
  BadCredentialsError,
  ResourceNotFoundError,
} from '../../helpers/error';
import UserDto from '../../dtos/user.dto';
import {
  generateTokens,
  saveToken,
  removeToken,
  validateRefreshToken,
  findToken,
} from '../../services/db/token.services';
import bcrypt from 'bcrypt';
import { UnAuthorizedError, ApplicationError } from '../../helpers/error';

const getUserSession = async (id: string) => {
  const session = generateTokens(id);

  await saveToken(id, session.refresh_token);

  return session;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({
    where: { email },
    row: true,
  });

  if (!user) {
    throw new ResourceNotFoundError('User');
  }

  const isPasswordsEqual = await bcrypt.compare(password, user.password);

  if (!isPasswordsEqual) {
    throw new BadCredentialsError('Bad password');
  }

  const user_session = await getUserSession(user.id);

  return user_session;
};

export const createUser = async (payload: object) => {
  let user;
  try {
    user = await User.create(payload);
  } catch (error) {
    throw new Error('Could not create user');
  }

  const userDto = new UserDto(user);
  const user_session = await getUserSession(user.id);

  return { user_session, ...userDto };
};

export const logout = async (refreshToken: string) => {
  await removeToken(refreshToken);
};

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApplicationError('Invalid refresh token.', 401);
  }

  const userFormToken = validateRefreshToken(refreshToken);
  const tokenFromBd = await findToken(refreshToken);

  if (
    !userFormToken ||
    !tokenFromBd ||
    tokenFromBd.owner_id !== userFormToken.id
  ) {
    throw new ApplicationError('Invalid refresh token.', 401);
  }
  const user = await User.findOne({ where: { id: userFormToken.id } });

  if (!user) {
    throw new UnAuthorizedError();
  }

  const user_session = await getUserSession(user.id);

  return user_session;
};
