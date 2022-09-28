import express from 'express';
import { getUserAction } from '../controllers/users.controller';
import { paramsIdValidation } from '../validations/global.validation';

const router = express.Router();

router.get('/:id', paramsIdValidation, getUserAction);

export default router;
