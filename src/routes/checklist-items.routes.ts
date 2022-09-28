import express from 'express';
import {
  createChecklistItemAction,
  deleteChecklistItemAction,
  deleteChecklistItemsAction,
} from '../controllers/checklist-items.controller';
import {
  createChecklistItemValidation,
  deleteChecklistItemsValidation,
} from '../validations/checklist-items.validation';
import { paramsIdValidation } from '../validations/global.validation';

const router = express.Router();

router.delete('/:id', paramsIdValidation, deleteChecklistItemAction);
router.delete('/', deleteChecklistItemsValidation, deleteChecklistItemsAction);
router.post('/', createChecklistItemValidation, createChecklistItemAction);

export default router;
