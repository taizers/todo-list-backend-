// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Task, Taskattachment, User } = require('../../db/models/index');
import {
  ResourceNotFoundError,
  EntityNotFoundError,
} from '../../helpers/error';
import UserDto from '../../dtos/user.dto';
import TaskAttachmentDto from '../../dtos/task-attachment.dto';

import {
  TaskAttachmentType,
  UserType,
  TaskFromDBType,
} from '../../types/entities/global.entities.type';
import { sequelize } from '../../db/models';

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
    members: dtosUsers || null,
    attachments: dtosAttachments || null,
  };

  return resultTask;
};

export const checkTask = async (id: number | string) => {
  const task = await Task.findByPk(id);

  if (!task) {
    throw new ResourceNotFoundError('Task');
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
  members: Array<number> | null
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
  const user = await User.findByPk(id, {
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
  members: Array<number> | undefined,
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
