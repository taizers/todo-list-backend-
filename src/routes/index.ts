import express from 'express';

import {
  signUpAction,
  loginAction,
  refreshAction,
  logoutAction,
} from '../controllers/auth.controller';
import {
  searchMembersAction,
  uploadUserAvatarAction,
  getUserStatisticAction,
} from '../controllers/users.controller';
import {
  searchProjectAction,
  getProjectsStatisticAction,
  getUserProjectsAction,
} from '../controllers/projects.controller';
import { getUserChecklistsAction } from '../controllers/checklists.controller';
import {
  getAssignedTasksAction,
  getMemberTasksAction,
  getProjectTasksAction,
  getUserTasksAction,
  uploadTaskAttachmentAction,
} from '../controllers/tasks.controller';
import {
  getTaskCommentsAction,
  uploadCommentAttachmentAction,
} from '../controllers/comments.controller';
import { getUserNotesAction } from '../controllers/notes.controller';

import {
  signUpValidation,
  loginValidation,
  cookiesValidation,
} from '../validations/auth.validation';
import { searchValidation } from '../validations/projects.validation';
import { paramsIdValidation } from '../validations/global.validation';
import { uploadCommentAttachmentValidation } from '../validations/comments.validation';
import { uploadTaskAttachmentValidation } from '../validations/tasks.validation';

import notesRouter from './notes.routes';
import checklistsRouter from './checklists.routes';
import checklistItemsRouter from './checklist-items.routes';
import projectsRouter from './projects.routes';
import tasksRouter from './tasks.routes';
import commentsRouter from './comments.routes';
import usersRouter from './users.routes';

import {
  uploadTaskAttachmentsMiddleware,
  uploadCommentAttachmentsMiddleware,
  uploadPhotoMiddleware,
} from '../middlewares/upload.middleware';
import verifyToken from '../middlewares/auth.middleware';

const router = express.Router();

// Authorization

router.post('/sign-up', signUpValidation, signUpAction);
router.post('/sign-in', loginValidation, loginAction);
router.post('/refresh-token', cookiesValidation, refreshAction);
router.post('/sign-out', cookiesValidation, logoutAction);

// Search

router.get(
  '/projects-search',
  verifyToken,
  searchValidation,
  searchProjectAction
);
router.get(
  '/task-members-search',
  verifyToken,
  searchValidation,
  searchMembersAction
);

// Get Relations

router.get(
  '/project-tasks/:id',
  verifyToken,
  paramsIdValidation,
  getProjectTasksAction
);
router.get(
  '/assigned-tasks/:id',
  verifyToken,
  paramsIdValidation,
  getAssignedTasksAction
);
router.get(
  '/tasks-comments/:id',
  verifyToken,
  paramsIdValidation,
  getTaskCommentsAction
);
router.get(
  '/participate-in-tasks/:id',
  verifyToken,
  paramsIdValidation,
  getMemberTasksAction
);
router.get(
  '/user-tasks/:id',
  verifyToken,
  paramsIdValidation,
  getUserTasksAction
);
router.get(
  '/user-projects/:id',
  verifyToken,
  paramsIdValidation,
  getUserProjectsAction
);
router.get(
  '/user-checklists/:id',
  verifyToken,
  paramsIdValidation,
  getUserChecklistsAction
);
router.get(
  '/user-notes/:id',
  verifyToken,
  paramsIdValidation,
  getUserNotesAction
);

// Get Statistics

router.get(
  '/users-statistics/:id',
  verifyToken,
  paramsIdValidation,
  getUserStatisticAction
);
router.get(
  '/projects-statistics/:id',
  verifyToken,
  paramsIdValidation,
  getProjectsStatisticAction
);

// Upload Files

router.post(
  '/tasks-attachments',
  verifyToken,
  uploadTaskAttachmentsMiddleware.single('file'),
  uploadTaskAttachmentValidation,
  uploadTaskAttachmentAction
);
router.post(
  '/comments-attachments',
  verifyToken,
  uploadCommentAttachmentsMiddleware.single('file'),
  uploadCommentAttachmentValidation,
  uploadCommentAttachmentAction
);
router.post(
  '/users-avatar',
  verifyToken,
  uploadPhotoMiddleware.single('file'),
  uploadUserAvatarAction
);

// Get Files

router.use(
  '/tasks-attachments',
  verifyToken,
  express.static('files/tasks-attachments')
);
router.use(
  '/comments-attachments',
  verifyToken,
  express.static('files/comments-attachments')
);
router.use('/users-avatar', verifyToken, express.static('files/photos'));

// Routers

router.use('/notes', verifyToken, notesRouter);
router.use('/checklists', verifyToken, checklistsRouter);
router.use('/checklists-items', verifyToken, checklistItemsRouter);
router.use('/projects', verifyToken, projectsRouter);
router.use('/tasks', verifyToken, tasksRouter);
router.use('/comments', verifyToken, commentsRouter);
router.use('/users', verifyToken, usersRouter);

export default router;
