import { NextFunction, Response } from 'express';
import {
  findUser,
  findUsers,
  updateUser,
  getUserStatistic,
} from '../services/db/users.services';
import { customResponse } from '../helpers/responce';
import logger from '../helpers/logger';
import { Op } from 'sequelize';
import { UnProcessableEntityError } from '../helpers/error';
import { SearchMembersRequest } from '../types/requests/users.request.type';
import { ParamsIdRequest } from '../types/requests/global.request.type';

export const getUserAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get User Action: { id: ${id} } `);

  try {
    const users = await findUser({ id });

    return customResponse(res, 200, users);
  } catch (err) {
    logger.error('Get User Action - Cannot get users', err);
    next(err);
  }
};

export const getUserStatisticAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get User Statistics Action: { id: ${id} } `);

  try {
    const users = await getUserStatistic(id);

    return customResponse(res, 200, users);
  } catch (err) {
    logger.error('Get User Statistics Action - Cannot get users', err);
    next(err);
  }
};

export const uploadUserAvatarAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new UnProcessableEntityError('File Not Found'));
  }
  const { id } = req.user;
  const { filename } = req.file;

  logger.info(
    `Upload User Avatar Action: { userId: ${id}, filename: ${filename} } `
  );

  try {
    const user = await updateUser(id, { avatar: filename });

    return customResponse(res, 200, user);
  } catch (err) {
    logger.error('Upload User Avatar Action - Cannot get users', err);
    next(err);
  }
};

export const searchMembersAction = async (
  req: SearchMembersRequest,
  res: Response,
  next: NextFunction
) => {
  const { query } = req.query;

  logger.info(`Search Members Action: { query: ${query} } `);

  try {
    const users = await findUsers({ username: { [Op.substring]: query } });

    return customResponse(res, 200, users);
  } catch (err) {
    logger.error('Search Members Action - Cannot get user', err);
    next(err);
  }
};
