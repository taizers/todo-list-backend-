// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Note } = require('../../db/models/index');
import {
  ResourceNotFoundError,
  EntityNotFoundError,
  DontHaveAccessError,
} from '../../helpers/error';

export const checkNote = async (
  id: string,
  userId?: string
) => {
  const note = await Note.findByPk(id);

  if (!note) {
    throw new ResourceNotFoundError('Note');
  }

  if (userId && note.owner_id !== userId) {
    throw new DontHaveAccessError();
  }
};

export const findNote = async (where: object) => {
  const note = await Note.findOne({
    where,
    row: true,
  });

  if (!note) {
    throw new ResourceNotFoundError('Note');
  }

  return note;
};

export const createNote = async (payload: object) => {
  let note;

  try {
    note = await Note.create(payload);
  } catch (error) {
    throw new Error('Could not create note');
  }

  return note;
};

export const deleteNote = async (id: string) => {
  const result = await Note.destroy({ where: { id } });

  if (result === 0) {
    throw new EntityNotFoundError(id, 'NoteModel');
  }
};

export const findUserNotes = async (userId: string) => {
  const notes = await Note.findAll({
    where: { owner_id: userId },
  });

  return notes;
};

export const updateNote = async (id: string, payload: object) => {
  let note;

  try {
    note = await Note.update(payload, {
      where: { id },
      returning: true,
      plain: true,
    });
  } catch (error) {
    throw new Error('Could not update note');
  }

  return note[1];
};
