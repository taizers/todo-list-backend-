// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Project } = require('../../db/models/index');
import {
  ResourceNotFoundError,
  EntityNotFoundError,
} from '../../helpers/error';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../../db/models';

export const checkProject = async (id: number | string) => {
  const project = await Project.findByPk(id);

  if (!project) {
    throw new ResourceNotFoundError('Project');
  }
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
    SELECT projects.*, 
      (SELECT COUNT(tasks.id)
      FROM tasks 
      WHERE (tasks.deleted_at IS NULL AND (tasks.project_id = projects.id AND tasks.is_completed = false))) as tasks_number 
    FROM projects, tasks, task_members 
    WHERE (projects.deleted_at IS NULL 
      AND (projects.owner_id = ${id} 
        OR (tasks.deleted_at IS NULL 
          AND (projects.id = tasks.project_id 
            AND (tasks.owner_id = ${id} OR tasks.assigned_to = ${id}))) 
        OR (task_members.deleted_at IS NULL AND tasks.deleted_at IS NULL
          AND (projects.id = tasks.project_id 
            AND task_members.task_id = tasks.id 
            AND task_members.user_id = ${id})))) 
    GROUP BY projects.id 
    ORDER BY projects.id`,
    { type: QueryTypes.SELECT }
  );

  return projects;
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