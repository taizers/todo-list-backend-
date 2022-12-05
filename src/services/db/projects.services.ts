// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Project, Task } = require('../../db/models/index');
import {
  ResourceNotFoundError,
  EntityNotFoundError,
  DontHaveAccessError,
} from '../../helpers/error';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../../db/models';
import { deleteTask } from './tasks.services';

export const getAndCheckProject = async (id: string, userId?: string) => {
  const project = await Project.findOne({ where: { id } });

  if (!project) {
    throw new ResourceNotFoundError('Project');
  }

  if (userId && project.owner_id !== userId) {
    throw new DontHaveAccessError();
  }

  return project;
};

export const findProject = async (where: object) => {
  const project = await Project.findOne({
    where,
    row: true,
  });

  if (!project) {
    throw new ResourceNotFoundError('Project');
  }

  return project;
};

export const createProject = async (payload: object) => {
  let project;

  try {
    project = await Project.create(payload);
  } catch (error) {
    throw new Error('Could not create project');
  }

  return project;
};

export const deleteProject = async (id: string) => {
  const tasks = await Task.findAll({ where: { project_id: id } });

  await Promise.all(
    tasks.map(async (item: { id: string }) => {
      await deleteTask(item.id);
    })
  );

  const result = await Project.destroy({ where: { id } });

  if (result === 0) {
    throw new EntityNotFoundError(id, 'ProjectModel');
  }
};

export const findProjects = async (where: object) => {
  const projects = await Project.findAll({
    where,
  });

  if (!projects.length) {
    throw new ResourceNotFoundError('Project');
  }

  return projects;
};

export const getProjectsStatistic = async (id: string) => {
  const projects = await sequelize.query(
    `
    SELECT projects.id, 
      (SELECT COUNT(tasks.id)
      FROM tasks 
      WHERE (tasks.project_id = projects.id AND tasks.is_completed = false)) as tasks_number 
    FROM projects, tasks 
    WHERE (projects.owner_id = '${id}' OR (projects.id = tasks.project_id 
            AND (tasks.owner_id = '${id}' OR tasks.assigned_to = '${id}'))
          )
    GROUP BY projects.id 
    ORDER BY projects.id`,
    { type: QueryTypes.SELECT }
  );

  const statistic = projects.map((item: any) => ({
    project_id: id,
    tasks_number: Number(item.tasks_number),
  }));

  return statistic;
};

export const updateProject = async (id: string, payload: object) => {
  let project;

  try {
    project = await Project.update(payload, {
      where: { id },
      returning: true,
      plain: true,
    });
  } catch (error) {
    throw new Error('Could not update Project');
  }

  return project[1];
};
