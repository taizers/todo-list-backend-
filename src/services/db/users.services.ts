// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Note, User, Task } = require('../../db/models/index');

import UserDto from '../../dtos/user.dto';
import Sequelize = require('sequelize');
import { UserType } from '../../types/entities/global.entities.type';
import {
  EntityNotFoundError,
  ResourceNotFoundError,
} from '../../helpers/error';

const Op = Sequelize.Op;

const getEventsValue = async (id: string) => {
  const { count: countCompletedTaskByOwner } = await Task.findAndCountAll({
    where: { is_completed: true, owner_id: id },
  });

  const { count: countTaskByOwner } = await Task.findAndCountAll({
    where: { owner_id: id },
  });

  return Math.round((countCompletedTaskByOwner / countTaskByOwner) * 100);
};

const getTodoValue = async (id: string) => {
  const { count: countNoNCompletedTaskByAssigned } = await Task.findAndCountAll(
    {
      where: { is_completed: false, assigned_to: id },
    }
  );

  const { count: countTaskByAssigned } = await Task.findAndCountAll({
    where: { assigned_to: id },
  });

  return Math.round(
    (countNoNCompletedTaskByAssigned / countTaskByAssigned) * 100
  );
};

const getQuickNotesValue = async (id: string) => {
  const { count: countCompletedNotes } = await Note.findAndCountAll({
    where: { is_completed: true, owner_id: id },
  });

  const { count: countNotes } = await Note.findAndCountAll({
    where: { owner_id: id },
  });

  return Math.round((countCompletedNotes / countNotes) * 100);
};

export const checkUser = async (id: string) => {
  const user = await User.findOne({ where: { id } });

  if (!user) {
    throw new ResourceNotFoundError('User');
  }
};

export const findUser = async (where: object) => {
  const user = await User.findOne({
    where,
    row: true,
  });

  let dtosUser;

  if (user) {
    dtosUser = new UserDto(user);
  }

  return dtosUser;
};

export const getUserStatistic = async (id: string) => {
  const user = await findUser({ id });

  if (!user) {
    throw new EntityNotFoundError(id, 'UserModel');
  }

  const { count: countCreatedTask } = await Task.findAndCountAll({
    where: { owner_id: id },
  });
  const { count: countCompletedTask } = await Task.findAndCountAll({
    where: {
      is_completed: true,
      [Op.or]: [{ owner_id: id }, { assigned_to: id }],
    },
  });

  const events = await getEventsValue(id);
  const todo = await getTodoValue(id);
  const quickNotes = await getQuickNotesValue(id);

  const statistic = {
    created_tasks: countCreatedTask,
    completed_tasks: countCompletedTask,
    events: `${events || 0}%`,
    quick_notes: `${quickNotes || 0}%`,
    todo: `${todo || 0}%`,
  };

  return statistic;
};

export const findUsers = async (where: object) => {
  const users = await User.findAll({
    where,
  });

  const dtosUsers = users?.map((user: UserType) => new UserDto(user));

  return dtosUsers;
};

export const updateUser = async (id: string, payload: object) => {
  let user;

  try {
    user = await User.update(payload, {
      where: { id },
      returning: true,
      plain: true,
    });
  } catch (error) {
    throw new Error('Could not update user');
  }

  return new UserDto(user[1]);
};
