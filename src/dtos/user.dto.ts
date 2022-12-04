import dotenv from 'dotenv';
dotenv.config();

import { photosPath } from '../constants';
import { UserType } from '../types/entities/global.entities.type';

export default class UserDto {
  id;
  email;
  username;
  avatar_url;
  created_at;

  constructor(model: UserType) {
    this.id = model.id;
    this.email = model.email;
    this.avatar_url =
      model.avatar ? `${process.env.BACKEND_URL}${photosPath}/${model.avatar}` : '';
    this.username = model.username;
    this.created_at = model.created_at;
  }
}
