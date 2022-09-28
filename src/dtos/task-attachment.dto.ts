import dotenv from 'dotenv';
dotenv.config();

import { taskAttachmentsPath } from '../constants';
import { TaskAttachmentType } from '../types/entities/global.entities.type';

export default class TaskAttachmentDto {
  id;
  type;
  url;
  task_id;
  created_at;
  updated_at;
  deleted_at;

  constructor(model: TaskAttachmentType) {
    this.id = model.id;
    this.task_id = model.task_id;
    this.url =
      model.name &&
      `${process.env.BACKEND_URL}${taskAttachmentsPath}/${model.name}`;
    this.type = model.type;
    this.created_at = model.created_at;
    this.updated_at = model.updated_at;
    this.deleted_at = model.deleted_at;
  }
}
