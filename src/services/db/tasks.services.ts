// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Task, Taskattachment, User, Comment } = require('../../db/models/index');
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs').promises;
import path from 'path';

import {
  ResourceNotFoundError,
  EntityNotFoundError,
  DontHaveAccessError,
} from '../../helpers/error';
import UserDto from '../../dtos/user.dto';
import TaskAttachmentDto from '../../dtos/task-attachment.dto';

import {
  TaskAttachmentType,
  UserType,
  TaskFromDBType,
} from '../../types/entities/global.entities.type';
import { sequelize } from '../../db/models';
import { taskAttachmentsPath } from '../../constants';
import { deleteComment } from './comments.services';

const convertTaskAttachment = (attachments: Array<TaskAttachmentType>) => {
  const dtosAttachments = attachments?.map((attachment: TaskAttachmentType) => {
    const attachmentDto = new TaskAttachmentDto(attachment);
    return { ...attachmentDto };
  });

  return dtosAttachments;
};

const convertMembers = (members: Array<UserType>) => {
  const dtosUsers = members?.map((user: UserType) => {
    const userDto = new UserDto(user);
    return { ...userDto };
  });

  return dtosUsers;
};

const convertUsersAndAttachmentsInTask = (task: TaskFromDBType) => {
  const dtosUsers = convertMembers(task?.members);
  const dtosAttachments = convertTaskAttachment(task?.attachments);

  const resultTask = {
    ...task.dataValues,
    due_date: moment(task.dataValues.due_date).format('YYYY-MM-DD[T]HH:mm'),
    created_at: moment(task.dataValues.created_at).format(
      'YYYY-MM-DD[T]HH:mm:ss.SSS'
    ),
    members: dtosUsers.length ? dtosUsers : null,
    attachments: dtosAttachments.length ? dtosAttachments : null,
  };

  return resultTask;
};

export const checkTask = async (id: string, userId?: string) => {
  const task = await Task.findOne({ where: { id } });

  if (!task) {
    throw new ResourceNotFoundError('Task');
  }

  if (userId && task.owner_id !== userId && task.assigned_to !== userId) {
    throw new DontHaveAccessError();
  }
};

export const findTask = async (where: object) => {
  const task = await Task.findOne({
    where,
    include: [
      {
        model: User,
        as: 'members',
        attributes: { exclude: ['password'] },
        through: {
          attributes: [],
        },
      },
      {
        model: Taskattachment,
        as: 'attachments',
      },
    ],
  });
  if (!task) {
    throw new ResourceNotFoundError('Task');
  }

  return convertUsersAndAttachmentsInTask(task);
};

export const createTask = async (
  payload: object,
  members: Array<string> | null
) => {
  const transaction = await sequelize.transaction();
  let task;

  try {
    task = await Task.create(payload, { transaction });

    await task?.addMembers(members, { transaction });

    await transaction.commit();

    task = await findTask({ id: task.id });
  } catch (error) {
    await transaction.rollback();
    throw new Error('Could not create task');
  }

  return task;
};

export const deleteTask = async (id: string) => {
  const attachments = await Taskattachment.findAll({ where: { task_id: id } });

  await Promise.all(
    attachments.map(async (item: { id: string; name: string }) => {
      await fs.unlink(path.join('files', taskAttachmentsPath, item.name));

      const result = await Taskattachment.destroy({ where: { id: item.id } });

      if (result === 0) {
        throw new EntityNotFoundError(item.id, 'Task Attachment Model');
      }
    })
  );

  const comments = await Comment.findAll({ where: { task_id: id } });

  await Promise.all(
    comments.map(async (item: { id: string }) => {
      await deleteComment(item.id);
    })
  );

  const task = await Task.findOne({
    where: { id },
    row: true,
  });

  const taskMembers = await task?.getMembers();
  taskMembers && await task?.removeMembers(taskMembers);

  const result = await Task.destroy({ where: { id } });

  if (result === 0) {
    throw new EntityNotFoundError(id, 'TaskModel');
  }
};

export const findTasks = async (where: object) => {
  const tasks = await Task.findAll({
    where,
    include: [
      {
        model: User,
        as: 'members',
        attributes: { exclude: ['password'] },
        through: {
          attributes: [],
        },
      },
      {
        model: Taskattachment,
        as: 'attachments',
      },
    ],
  });

  const resultTasks = tasks?.map((task: TaskFromDBType) =>
    convertUsersAndAttachmentsInTask(task)
  );

  return resultTasks;
};

export const findMemberTasks = async (id: string) => {
  const user = await User.findOne({
    where: { id },
    attributes: [],
    include: [
      {
        model: Task,
        as: 'members',
        through: {
          attributes: [],
        },
        include: [
          {
            model: User,
            as: 'members',
            attributes: { exclude: ['password'] },
            through: {
              attributes: [],
            },
          },
          {
            model: Taskattachment,
            as: 'attachments',
          },
        ],
      },
    ],
  });

  const resultTasks = user?.members?.map((task: TaskFromDBType) =>
    convertUsersAndAttachmentsInTask(task)
  );

  return resultTasks;
};

export const uploadTaskAttachement = async (payload: object) => {
  let attachment;

  try {
    attachment = await Taskattachment.create(payload);
  } catch (error) {
    throw new ResourceNotFoundError('Task');
  }

  return new TaskAttachmentDto(attachment);
};

export const updateTask = async (
  id: string,
  members: Array<string> | undefined,
  payload: object
) => {
  let task;

  await Task.update(payload, {
    where: { id },
  });

  try {
    if (members?.length) {
      task = await Task.findOne({
        where: { id },
        row: true,
      });

      const taskMembers = await task?.getMembers();
      await task?.removeMembers(taskMembers);
      await task?.addMembers(members);
    }

    task = await findTask({ id });
  } catch (error) {
    throw new Error('Could not update tasks');
  }

  return task;
};
