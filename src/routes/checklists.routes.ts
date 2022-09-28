import express from 'express';
import {
  getChecklistAction,
  createChecklistAction,
  deleteChecklistAction,
  updateChecklistAction,
} from '../controllers/checklists.controller';
import {
  createChecklistValidation,
  updateChecklistValidation,
} from '../validations/checklists.validation';
import { paramsIdValidation } from '../validations/global.validation';

const router = express.Router();

router.post('/', createChecklistValidation, createChecklistAction);
router.delete('/:id', paramsIdValidation, deleteChecklistAction);
router.put('/:id', updateChecklistValidation, updateChecklistAction);
router.get('/:id', paramsIdValidation, getChecklistAction);

export default router;
