import express from 'express';
import {
  createCommentAction,
  deleteCommentAction,
} from '../controllers/comments.controller';
import { createCommentValidation } from '../validations/comments.validation';
import { paramsIdValidation } from '../validations/global.validation';

const router = express.Router();

router.post('/', createCommentValidation, createCommentAction);
router.delete('/:id', paramsIdValidation, deleteCommentAction);

export default router;
