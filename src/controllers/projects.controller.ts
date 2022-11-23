import { NextFunction, Response } from 'express';
import {
  findProject,
  findProjects,
  createProject,
  deleteProject,
  updateProject,
  getProjectsStatistic,
  getAndCheckProject,
} from '../services/db/projects.services';
import { customResponse } from '../helpers/responce';
import logger from '../helpers/logger';
import { ParamsIdRequest } from '../types/requests/global.request.type';
import { Op } from 'sequelize';
import { checkUser } from '../services/db/users.services';

export const createProjectAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { title, color } = req.body;
  const { id } = req.user;

  logger.info(
    `Create Project Action: { title: ${title}, color: ${color}, userId: ${id} } `
  );

  try {
    const project = await createProject({
      title,
      color,
      owner_id: id,
    });

    return customResponse(res, 200, project);
  } catch (err) {
    logger.error('Create Project Action - Cannot create project', err);
    next(err);
  }
};

export const deleteProjectAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  logger.info(`Delete Project Action: { id: ${id} } `);

  try {
    const project = await getAndCheckProject(id, userId);

    if (project.title === 'Personal') {
      return customResponse(res, 400, {
        code: 400,
        message: 'You Cannot delete personal project',
      });
    }
  } catch (err) {
    next(err);
  }

  try {
    await deleteProject(id);

    return customResponse(res, 200, { id });
  } catch (err) {
    logger.error('Delete Project Action - Cannot delete project', err);
    next(err);
  }
};

export const getProjectAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Project Action: { id: ${id} } `);

  try {
    const project = await findProject({ id });

    return customResponse(res, 200, project);
  } catch (err) {
    logger.error('Get Project Action - Cannot get project', err);
    next(err);
  }
};

export const getUserProjectsAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get User Projects Action: { id: ${id} } `);

  try {
    await checkUser(id);
    const projects = await findProjects({ owner_id: id });

    return customResponse(res, 200, projects);
  } catch (err) {
    logger.error('Get User Projects Action - Cannot get projects', err);
    next(err);
  }
};

export const getProjectsStatisticAction = async (
  req: ParamsIdRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  logger.info(`Get Projects Statistic Action: { id: ${id} } `);

  try {
    await checkUser(id);
    const projects = await getProjectsStatistic(id);

    return customResponse(res, 200, projects);
  } catch (err) {
    logger.error('Get Projects Statistic Action - Cannot get projects', err);
    next(err);
  }
};

export const updateProjectAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { title, color } = req.body;
  const { id } = req.params;
  const { id: userId } = req.user;

  logger.info(`Update Project Action: { title: ${title}, color: ${color} } `);

  let project;
  try {
    await getAndCheckProject(id, userId);
    project = await updateProject(id, {
      title,
      color,
    });

    return customResponse(res, 200, project);
  } catch (err) {
    logger.error('Update Project Action - Cannot update project', err);
    next(err);
  }
};

export const searchProjectAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { query } = req.query;
  const { id } = req.user;

  logger.info(`Search Project Action: { query: ${query} } `);

  let project;

  try {
    project = await findProjects({ title: { [Op.substring]: query }, owner_id:  id});

    return customResponse(res, 200, project);
  } catch (err) {
    logger.error('Search Project Action - Cannot get project', err);
    next(err);
  }
};
