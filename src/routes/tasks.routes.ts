import express from 'express';
import {
  createTaskAction,
  deleteTaskAction,
  getTaskAction,
  updateTaskAction,
} from '../controllers/tasks.controller';
import {
  createTaskValidation,
  updateTaskValidation,
} from '../validations/tasks.validation';
import { paramsIdValidation } from '../validations/global.validation';

const router = express.Router();

router.post('/', createTaskValidation, createTaskAction);
router.delete('/:id', paramsIdValidation, deleteTaskAction);
router.put('/:id', updateTaskValidation, updateTaskAction);
router.get('/:id', paramsIdValidation, getTaskAction);

export default router;
