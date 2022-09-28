import express from 'express';
import {
  createNoteAction,
  deleteNoteAction,
  getNoteAction,
  updateNoteAction,
} from '../controllers/notes.controller';
import {
  createNoteValidation,
  updateNoteValidation,
} from '../validations/notes.validation';
import { paramsIdValidation } from '../validations/global.validation';

const router = express.Router();

router.post('/', createNoteValidation, createNoteAction);
router.delete('/:id', paramsIdValidation, deleteNoteAction);
router.put('/:id', updateNoteValidation, updateNoteAction);
router.get('/:id', paramsIdValidation, getNoteAction);

export default router;
