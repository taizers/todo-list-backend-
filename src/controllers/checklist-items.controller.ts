import { NextFunction, Response } from 'express';
import {
  deleteChecklistItem,
  createChecklistItem,
  deleteChecklistItems,
  getChecklistId,
} from '../services/db/checklist-items.services';
import { customResponse } from '../helpers/responce';
import { CreateChecklistItemRequest } from '../types/requests/checklist-items.request.type';
import logger from '../helpers/logger';
import { checkChecklist } from '../services/db/checklists.services';

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
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  logger.info(`Delete Checklist Item Action: { id: ${id} } `);

  try {
    const checklistId = await getChecklistId(id);

    await checkChecklist(checklistId, userId);
    await deleteChecklistItem(id);

    return customResponse(res, 200, { id });
  } catch (err) {
    logger.error('Delete Checklist Item Action - Cannot delete Checklist', err);
    next(err);
  }
};

export const deleteChecklistItemsAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { items } = req.body;
  const { id } = req.user;

  logger.info(
    `Delete Checklist Item Action: { items.length: ${items.length} } `
  );

  try {
    await Promise.all(
      items?.map(async (item: string) => {
        const checklistId = await getChecklistId(item);
        await checkChecklist(checklistId, id);
      })
    );
    await deleteChecklistItems(items);

    return customResponse(res, 200, { items });
  } catch (err) {
    logger.error('Delete Checklist Item Action - Cannot delete Checklist', err);
    next(err);
  }
};
