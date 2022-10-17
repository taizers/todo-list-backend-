import { NextFunction, Response } from 'express';
import {
  findTask,
  findTasks,
  createTask,
  deleteTask,
  updateTask,
  uploadTaskAttachement,
  findMemberTasks,
  checkTask,
} from '../services/db/tasks.services';
import { checkUser } from '../services/db/users.services';
import { customResponse } from '../helpers/responce';
import logger from '../helpers/logger';
import { ParamsIdRequest } from '../types/requests/global.request.type';
import { UnProcessableEntityError } from '../helpers/error';
import { getAndCheckProject } from '../services/db/projects.services';

export const createTaskAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    due_date,
    description,
    assigned_to,
    is_completed,
    project_id,
    members,
  } = req.body;
  const { id } = req.user;

  logger.info(
    `Create Task Action: { 
      description: ${description}, 
      title: ${title}, 
      assigned_to: ${assigned_to}, 
      project_id: ${project_id}, 
      is_completed: ${is_completed}, 
      due_date: ${due_date}, 
      owner_id: ${id} 
    } `
  );

  try {
    if (assigned_to) {
      await checkUser(assigned_to);
    }

    await getAndCheckProject(project_id, id);

    const task = await createTask(
      {
        description,
        title,
        assigned_to,
        project_id,
        is_completed,
        due_date,
        owner_id: id,
      },
      members
    );

    return customResponse(res, 200, task);
  } catch (err) {
    logger.error('Create Task Action - Cannot create task', err);
    next(err);
  }
};

export const deleteTaskAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  logger.info(`Delete Task Action: { id: ${id} } `);

  try {
    await checkTask(id, userId);

    await deleteTask(id);

    return customResponse(res, 200, { id });
  } catch (err) {
    logger.error('Delete Task Action - Cannot delete task', err);
    next(err);
  }
};

export const getTaskAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Task Action: { id: ${id} } `);

  try {
    const task = await findTask({ id });

    return customResponse(res, 200, task);
  } catch (err) {
    logger.error('Get Task Action - Cannot get task', err);
    next(err);
  }
};

export const getUserTasksAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get User Tasks Action: { id: ${id} } `);

  try {
    await checkUser(id);
    const tasks = await findTasks({ owner_id: id });

    return customResponse(res, 200, tasks);
  } catch (err) {
    logger.error('Get User Tasks Action - Cannot get tasks', err);
    next(err);
  }
};

export const getAssignedTasksAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Assigned Tasks Action: { id: ${id} } `);

  try {
    await checkUser(id);
    const tasks = await findTasks({ assigned_to: id });

    return customResponse(res, 200, tasks);
  } catch (err) {
    logger.error('Get Assigned Tasks Action - Cannot get tasks', err);
    next(err);
  }
};

export const getMemberTasksAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Member Tasks Action: { id: ${id} } `);

  try {
    await checkUser(id);
    const tasks = await findMemberTasks(id);

    return customResponse(res, 200, tasks);
  } catch (err) {
    logger.error('Get Member Tasks Action - Cannot get tasks', err);
    next(err);
  }
};

export const getProjectTasksAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Project Tasks Action: { id: ${id} } `);

  try {
    const tasks = await findTasks({ project_id: id });

    return customResponse(res, 200, tasks);
  } catch (err) {
    logger.error('Get Project Tasks Action - Cannot get tasks', err);
    next(err);
  }
};

export const uploadTaskAttachmentAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new UnProcessableEntityError('File Not Found'));
  }

  const { task_id, type } = req.body;
  const { filename } = req.file;
  const { id } = req.user;

  logger.info(
    `Upload Task Attachment Action: { task_id: ${task_id}, type: ${type}, filename: ${filename} } `
  );

  try {
    await checkTask(task_id, id);
    const attachment = await uploadTaskAttachement({
      task_id,
      type,
      name: filename,
    });

    return customResponse(res, 200, attachment);
  } catch (err) {
    logger.error('Upload Task Attachment Action - Cannot get tasks', err);
    next(err);
  }
};

export const updateTaskAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const {
    title,
    due_date,
    description,
    assigned_to,
    is_completed,
    project_id,
    members,
  } = req.body;

  logger.info(
    `Update Task Action: { 
      description: ${description}, 
      title: ${title}, 
      assigned_to: ${assigned_to}, 
      project_id: ${project_id}, 
      is_completed: ${is_completed}, 
      due_date: ${due_date}, 
      task_id: ${id} 
    } `
  );

  try {
    await checkTask(id, userId);

    if (assigned_to) {
      await checkUser(assigned_to);
    }
    if (project_id) {
      await getAndCheckProject(project_id);
    }

    const task = await updateTask(id, members, {
      title,
      due_date,
      description,
      assigned_to,
      is_completed,
      project_id,
    });

    return customResponse(res, 200, task);
  } catch (err) {
    logger.error('Update Task Action - Cannot update task', err);
    next(err);
  }
};
