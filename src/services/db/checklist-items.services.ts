// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Checklistitem } = require('../../db/models/index');
import { sequelize } from '../../db/models';
import { EntityNotFoundError, ApplicationError } from '../../helpers/error';

export const getChecklistId = async (id: string) => {
  const checklistitem = await Checklistitem.findOne({ where: { id } });

  if (!checklistitem) {
    throw new EntityNotFoundError(id.toString(), 'ChecklistItemModel');
  }

  return checklistitem.checklist_id;
};

export const createChecklistItem = async (payload: object) => {
  let checklitstItem;

  try {
    checklitstItem = await Checklistitem.create(payload);
  } catch (error) {
    throw new Error('Could not create checklist item');
  }

  return checklitstItem;
};

export const deleteChecklistItem = async (id: string) => {
  const result = await Checklistitem.destroy({ where: { id } });

  if (result === 0) {
    throw new EntityNotFoundError(id, 'ChecklistItemModel');
  }
};

export const deleteItemsFromChecklist = async (id: string) => {
  const result = await Checklistitem.destroy({ where: { checklist_id: id } });

  if (result === 0) {
    throw new ApplicationError('Cannot delete CheckList items', 409);
  }
};

export const deleteChecklistItems = async (items: Array<string>) => {
  const transaction = await sequelize.transaction();

  await Promise.all(
    items?.map(async (item) => {
      await Checklistitem.destroy({
        where: { id: item },
        transaction,
      });
    })
  );

  await transaction.commit();
};
