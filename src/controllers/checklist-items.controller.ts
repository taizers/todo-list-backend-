import { NextFunction, Response } from 'express';
import {
  deleteChecklistItem,
  createChecklistItem,
  deleteChecklistItems,
} from '../services/db/checklist-items.services';
import { customResponse } from '../helpers/responce';
import {
  CreateChecklistItemRequest,
  DeleteChecklistItemsRequest,
} from '../types/requests/checklist-items.request.type';
import { ParamsIdRequest } from '../types/requests/global.request.type';
import logger from '../helpers/logger';

export const createChecklistItemAction = async (
  req: CreateChecklistItemRequest,
  res: Response,
  next: NextFunction
) => {
  const { content, is_completed, checklist_id } = req.body;

  logger.info(
    `Create Checklist Item Action: { content: ${content}, is_completed: ${is_completed}, checklist_id: ${checklist_id} } `
  );

  try {
    const checklistItem = await createChecklistItem({
      content,
      is_completed,
      checklist_id,
    });

    return customResponse(res, 200, checklistItem);
  } catch (err) {
    logger.error(
      'Create Checklist Item Action - Cannot create Checklist Item',
      err
    );
    next(err);
  }
};

export const deleteChecklistItemAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Delete Checklist Item Action: { id: ${id} } `);

  try {
    await deleteChecklistItem(id);

    return customResponse(res, 200, { id });
  } catch (err) {
    logger.error('Delete Checklist Item Action - Cannot delete Checklist', err);
    next(err);
  }
};

export const deleteChecklistItemsAction = async (
  req: DeleteChecklistItemsRequest,
  res: Response,
  next: NextFunction
) => {
  const { items } = req.body;

  logger.info(
    `Delete Checklist Item Action: { items.length: ${items.length} } `
  );

  try {
    await deleteChecklistItems(items);

    return customResponse(res, 200, { items });
  } catch (err) {
    logger.error('Delete Checklist Item Action - Cannot delete Checklist', err);
    next(err);
  }
};
