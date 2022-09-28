// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Checklistitem } = require('../../db/models/index');
import { sequelize } from '../../db/models';
import { EntityNotFoundError } from '../../helpers/error';

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

export const deleteChecklistItems = async (items: Array<number>) => {
  const transaction = await sequelize.transaction();

  const notDeletedItems = await Promise.all(
    items?.map(async (item: number) => {
      const result = await Checklistitem.destroy({
        where: { id: item },
        transaction,
      });

      if (result === 0) {
        return item;
      }
    })
  );

  const string = notDeletedItems
    .filter((item: number | undefined) => item && item)
    .join()
    .split(',')
    .toString();

  if (notDeletedItems.length) {
    await transaction.rollback();
    throw new Error(
      `Could not delete items, Checklist Items "id:[${string}]" Not found`
    );
  }

  await transaction.commit();
};
