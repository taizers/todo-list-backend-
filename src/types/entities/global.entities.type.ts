export type CommentAttachmentType = {
  id: number;
  type: string;
  comment_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type TaskAttachmentType = {
  id: number;
  type: string;
  task_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type UserType = {
  id: number;
  email: string;
  username: string;
  avatar: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type TaskType = {
  id: number;
  title: string;
  description: string;
  due_date: Date;
  owner_id: number;
  assigned_to: number | null;
  project_id: number;
  is_completed: boolean;
  members: Array<UserType>;
  attachments: Array<TaskAttachmentType>;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type TaskFromDBType = {
  members: Array<UserType>;
  attachments: Array<TaskAttachmentType>;
  dataValues: object;
};

export type CommentType = {
  id: number;
  content: string;
  owner_id: number;
  task_id: number;
  attachments: Array<CommentAttachmentType>;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type CommentFromDBType = {
  attachments: Array<CommentAttachmentType>;
  dataValues: object;
};

export type UserSessionType = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user_id: number;
};
