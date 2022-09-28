import { NextFunction, Response } from 'express';
import {
  findComments,
  createComment,
  deleteComment,
  uploadCommentAttachement,
} from '../services/db/comments.services';
import { customResponse } from '../helpers/responce';
import { UnProcessableEntityError } from '../helpers/error';
import { ParamsIdRequest } from '../types/requests/global.request.type';
import logger from '../helpers/logger';
import { checkTask } from '../services/db/tasks.services';

export const createCommentAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { content, task_id } = req.body;
  const { id } = req.user;

  logger.info(
    `Create Comment Action: { 
      content: ${content}, 
      task_id: ${task_id},
      userId: ${id} 
    } `
  );

  try {
    await checkTask(task_id);
    const comment = await createComment({
      content,
      task_id,
      owner_id: id,
    });

    return customResponse(res, 200, comment);
  } catch (err) {
    logger.error('Create Comment Action - Cannot create comment', err);
    next(err);
  }
};

export const deleteCommentAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Delete Comment Action: { id: ${id} } `);

  try {
    await deleteComment(id);

    return customResponse(res, 200, { id });
  } catch (err) {
    logger.error('Delete Comment Action - Cannot delete comment', err);
    next(err);
  }
};

export const getTaskCommentsAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Task Comments Action: { id: ${id} } `);

  try {
    await checkTask(id);
    const comments = await findComments({ task_id: id });

    return customResponse(res, 200, comments);
  } catch (err) {
    logger.error('Get Task Comments Action - Cannot get comments', err);
    next(err);
  }
};

export const uploadCommentAttachmentAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new UnProcessableEntityError('File Not Found'));
  }

  const { comment_id, type } = req.body;
  const { filename } = req.file;

  logger.info(
    `Upload Comment Attachment Action: { comment_id: ${comment_id}, type: ${type}, filename: ${filename} } `
  );

  try {
    const attachment = await uploadCommentAttachement({
      comment_id,
      type,
      name: filename,
    });

    return customResponse(res, 200, attachment);
  } catch (err) {
    logger.error('Upload Comment Attachment Action - Cannot get comments', err);
    next(err);
  }
};
