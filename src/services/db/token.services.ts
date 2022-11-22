import jwt from 'jsonwebtoken';
import { EntityNotFoundError } from '../../helpers/error';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Token } = require('../../db/models/index');

export const generateTokens = (id: string) => {
  const access_token = jwt.sign({ id }, String(process.env.JWT_ACCESS_KEY), {
    expiresIn: '48h',
  });
  const refresh_token = jwt.sign({ id }, String(process.env.JWT_REFRESH_KEY), {
    expiresIn: '7d',
  });

  return {
    id,
    access_token,
    refresh_token,
    token_type: 'Bearer',
    expires_in: Date.now() + Number(process.env.JWT_REFRESH_MAX_AGE),
  };
};

export const validateAccessToken = (token: string) => {
  try {
    const user: any = jwt.verify(token, String(process.env.JWT_ACCESS_KEY));
    return user;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    const user: any = jwt.verify(token, String(process.env.JWT_REFRESH_KEY));
    return user;
  } catch (error) {
    return null;
  }
};

export const saveToken = async (owner_id: string, refresh_token: string) => {
  const token = await Token.findOne({ where: { owner_id } });

  if (token) {
    return await Token.update({ refresh_token }, { where: { owner_id } });
  }

  await Token.create({ refresh_token, owner_id });
};

export const removeToken = async (refresh_token: string) => {
  const result = await Token.destroy({ where: { refresh_token } });

  if (result === 0) {
    throw new EntityNotFoundError(refresh_token, 'TokenModel');
  }
};

export const findToken = async (refresh_token: string) => {
  return await Token.findOne({ where: { refresh_token } });
};
