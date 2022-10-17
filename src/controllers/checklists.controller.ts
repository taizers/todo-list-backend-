import { NextFunction, Response } from 'express';
import {
  findChecklist,
  findUserChecklists,
  createChecklist,
  deleteChecklist,
  updateChecklist,
  checkChecklist,
} from '../services/db/checklists.services';
import { customResponse } from '../helpers/responce';
import { ParamsIdRequest } from '../types/requests/global.request.type';
import logger from '../helpers/logger';
import { checkUser } from '../services/db/users.services';

export const createChecklistAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { title, color, items } = req.body;
  const { id } = req.user;

  logger.info(
    `Create Checklist Action: { title: ${title}, color: ${color}, userId: ${id} } `
  );

  let checklistPayload;

  if (items !== null) {
    checklistPayload = {
      title,
      color,
      owner_id: id,
      items,
    };
  } else {
    checklistPayload = {
      title,
      color,
      owner_id: id,
    };
  }

  try {
    const checklist = await createChecklist(checklistPayload);

    return customResponse(res, 200, checklist);
  } catch (err) {
    logger.error('Create Checklist Action - Cannot create Checklist', err);
    next(err);
  }
};

export const deleteChecklistAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  logger.info(`Delete Checklist Action: { id: ${id} } `);

  try {
    await checkChecklist(id, userId);
    await deleteChecklist(id);

    return customResponse(res, 200, { id });
  } catch (err) {
    logger.error('Delete Checklist Action - Cannot delete Checklist', err);
    next(err);
  }
};

export const getChecklistAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Checklist Action: { id: ${id} } `);

  try {
    const checklist = await findChecklist({ id });

    return customResponse(res, 200, checklist);
  } catch (err) {
    logger.error('Get Checklist Action - Cannot get Checklist', err);
    next(err);
  }
};

export const getUserChecklistsAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get User Checklists Action: { id: ${id} } `);

  try {
    await checkUser(id);
    const checklists = await findUserChecklists(id);

    return customResponse(res, 200, checklists);
  } catch (err) {
    logger.error('Get User Checklists Action - Cannot get Checklists', err);
    next(err);
  }
};

export const updateChecklistAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { title, color, items } = req.body;
  const { id } = req.params;
  const { id: userId } = req.user;

  logger.info(
    `Update Checklist Action: { title: ${title}, color: ${color}, id: ${id} } `
  );

  try {
    await checkChecklist(id, userId);
    const checklist = await updateChecklist(id, { title, color }, items);

    return customResponse(res, 200, checklist);
  } catch (err) {
    logger.error('Update Checklist Action - Cannot update Checklist', err);
    next(err);
  }
};
