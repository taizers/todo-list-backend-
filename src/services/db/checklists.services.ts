// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Checklist, Checklistitem } = require('../../db/models/index');
import {
  ResourceNotFoundError,
  EntityNotFoundError,
  DontHaveAccessError,
} from '../../helpers/error';

export const checkChecklist = async (
  id: number | string,
  userId?: number | string
) => {
  const checklist = await Checklist.findByPk(id);

  if (!checklist) {
    throw new ResourceNotFoundError('Checklist');
  }

  if (userId && checklist.owner_id !== userId) {
    throw new DontHaveAccessError();
  }
};

export const findChecklist = async (where: object) => {
  const checklist = await Checklist.findOne({
    where,
    include: [
      {
        model: Checklistitem,
        as: 'items',
      },
    ],
    row: true,
  });

  if (!checklist) {
    throw new ResourceNotFoundError('Checklist');
  }

  return checklist;
};

export const createChecklist = async (payload: object) => {
  let checklist;

  try {
    checklist = await Checklist.create(payload, {
      include: [
        {
          model: Checklistitem,
          as: 'items',
        },
      ],
    });
  } catch (error) {
    throw new Error('Could not create checklist');
  }

  return checklist;
};

export const deleteChecklist = async (id: string) => {
  const result = await Checklist.destroy({ where: { id } });

  if (result === 0) {
    throw new EntityNotFoundError(id, 'ChecklistModel');
  }
};

export const findUserChecklists = async (userId: string) => {
  const checklists = await Checklist.findAll({
    where: { owner_id: userId },
    include: [
      {
        model: Checklistitem,
        as: 'items',
      },
    ],
  });

  return checklists;
};

export const updateChecklist = async (
  id: string,
  payload: object,
  items: Array<{
    id: number | null;
    content: string;
    is_completed: boolean;
  }> | null
) => {
  let checklist;

  try {
    items?.forEach(async (element) => {
      const { id: checklistItemId, content, is_completed } = element;

      if (checklistItemId) {
        await Checklistitem.update(
          { content, is_completed },
          { where: { id: checklistItemId, checklist_id: id } }
        );
      } else {
        await Checklistitem.create({ content, is_completed, checklist_id: id });
      }
    });

    await Checklist.update(payload, {
      where: { id },
    });

    checklist = await Checklist.findOne({
      where: { id },
      include: [
        {
          model: Checklistitem,
          as: 'items',
        },
      ],
    });
  } catch (error) {
    throw new Error('Could not update checklist');
  }

  return checklist;
};
