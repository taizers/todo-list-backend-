import multer from 'multer';
import moment from 'moment';

const taskAttachmentsStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'files/tasks-attachments/');
  },
  filename(req, file, callback) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');

    callback(null, `${date}-${file.originalname}`);
  },
});

const commentAttachmentsStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'files/comments-attachments/');
  },
  filename(req, file, callback) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');

    callback(null, `${date}-${file.originalname}`);
  },
});

const photosStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'files/photos/');
  },
  filename(req, file, callback) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');

    callback(null, `${date}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, callback: any) => {
  console.log(file.mimetype);
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5,
};

export const uploadPhotoMiddleware = multer({
  storage: photosStorage,
  fileFilter,
  limits,
});

export const uploadTaskAttachmentsMiddleware = multer({
  storage: taskAttachmentsStorage,
  limits,
});

export const uploadCommentAttachmentsMiddleware = multer({
  storage: commentAttachmentsStorage,
  limits,
});
