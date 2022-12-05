export type CommentAttachmentType = {
  id: string;
  type: string;
  comment_id: string;
  name: string;
  created_at: Date;
};

export type TaskAttachmentType = {
  id: string;
  type: string;
  task_id: string;
  name: string;
  created_at: Date;
};

export type UserType = {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  created_at: Date;
};

export type TaskType = {
  id: string;
  title: string;
  description: string;
  due_date: Date;
  owner_id: string;
  assigned_to: string | null;
  project_id: string;
  is_completed: boolean;
  members: Array<UserType>;
  attachments: Array<TaskAttachmentType>;
  created_at: Date;
};

export type TaskFromDBType = {
  members: Array<UserType>;
  attachments: Array<TaskAttachmentType>;
  dataValues: any;
};

export type CommentType = {
  id: string;
  content: string;
  owner_id: string;
  task_id: string;
  attachments: Array<CommentAttachmentType>;
  created_at: Date;
};

export type CommentFromDBType = {
  attachments: Array<CommentAttachmentType>;
  dataValues: any;
};

export type UserSessionType = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user_id: string;
};
