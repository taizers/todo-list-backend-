import express from 'express';
import {
  createProjectAction,
  deleteProjectAction,
  getProjectAction,
  updateProjectAction,
} from '../controllers/projects.controller';
import {
  createProjectValidation,
  updateProjectValidation,
} from '../validations/projects.validation';
import { paramsIdValidation } from '../validations/global.validation';

const router = express.Router();

router.post('/', createProjectValidation, createProjectAction);
router.delete('/:id', paramsIdValidation, deleteProjectAction);
router.put('/:id', updateProjectValidation, updateProjectAction);
router.get('/:id', paramsIdValidation, getProjectAction);

export default router;
