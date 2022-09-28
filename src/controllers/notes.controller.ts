import { Response, NextFunction } from 'express';
import {
  findNote,
  findUserNotes,
  createNote,
  deleteNote,
  updateNote,
} from '../services/db/notes.services';
import { customResponse } from '../helpers/responce';
import { UpdateNoteRequest } from '../types/requests/notes.request.type';
import { ParamsIdRequest } from '../types/requests/global.request.type';
import logger from '../helpers/logger';
import { checkUser } from '../services/db/users.services';

export const createNoteAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { description, color } = req.body;
  const { id } = req.user;

  logger.info(
    `Create Note Action: { description: ${description}, color: ${color}, userId: ${id} } `
  );

  try {
    const note = await createNote({
      description,
      color,
      owner_id: Number(id),
    });

    return customResponse(res, 200, note);
  } catch (err) {
    logger.error('Create Note Action - Cannot create note', err);
    next(err);
  }
};

export const deleteNoteAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Delete Note Action: { id: ${id} } `);

  try {
    await deleteNote(id);

    return customResponse(res, 200, { id });
  } catch (err) {
    logger.error('Delete Note Action - Cannot delete note', err);
    next(err);
  }
};

export const getNoteAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Note Action: { id: ${id} } `);

  try {
    const note = await findNote({ id });

    return customResponse(res, 200, note);
  } catch (err) {
    logger.error('Get Note Action - Cannot get note', err);
    next(err);
  }
};

export const getUserNotesAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get User Notes Action: { id: ${id} } `);

  let notes;
  try {
    await checkUser(id);
    notes = await findUserNotes(id);

    return customResponse(res, 200, notes);
  } catch (err) {
    logger.error('Get User Notes Action - Cannot get notes', err);
    next(err);
  }
};

export const updateNoteAction = async (
  req: UpdateNoteRequest,
  res: Response,
  next: NextFunction
) => {
  const { description, color, is_completed } = req.body;
  const { id } = req.params;

  logger.info(
    `Update Note Action: { description: ${description}, color: ${color}, is_completed: ${is_completed} } `
  );

  let note;
  try {
    note = await updateNote(id, {
      description,
      color,
      is_completed,
    });

    return customResponse(res, 200, note);
  } catch (err) {
    logger.error('Update Note Action - Cannot update note', err);
    next(err);
  }
};
