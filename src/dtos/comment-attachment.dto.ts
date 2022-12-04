import dotenv from 'dotenv';
dotenv.config();

import moment from 'moment';

import { commentAttachmentsPath } from '../constants';
import { CommentAttachmentType } from '../types/entities/global.entities.type';

export default class CommentAttachmentDto {
  id;
  type;
  url;
  name;
  comment_id;
  created_at;

  constructor(model: CommentAttachmentType) {
    this.id = model.id;
    this.comment_id = model.comment_id;
    this.url =
      model.name ?
      `${process.env.BACKEND_URL}${commentAttachmentsPath}/${model.name}` : '';
    this.name = model.name;
    this.type = model.type;
    this.created_at = model.created_at;
  }
}
