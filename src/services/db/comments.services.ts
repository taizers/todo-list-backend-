// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Comment, Commentattachment } = require('../../db/models/index');
import {
  EntityNotFoundError,
  ResourceNotFoundError,
} from '../../helpers/error';
import {
  CommentAttachmentType,
  CommentFromDBType,
} from '../../types/entities/global.entities.type';

import CommentAttachmentDto from '../../dtos/comment-attachment.dto';

const convertAttchmentsInComment = (comment: CommentFromDBType) => {
  const dtosAttachments = comment?.attachments?.map(
    (attachment: CommentAttachmentType) => new CommentAttachmentDto(attachment)
  );

  return { ...comment.dataValues, attachments: dtosAttachments };
};

export const createComment = async (payload: object) => {
  let comment;

  try {
    comment = await Comment.create(payload);
  } catch (error) {
    throw new Error('Could not create comment');
  }

  return comment;
};

export const deleteComment = async (id: string) => {
  const result = await Comment.destroy({ where: { id } });

  if (result === 0) {
    throw new EntityNotFoundError(id, 'CommentModel');
  }
};

export const findComments = async (where: object) => {
  const comments = await Comment.findAll({
    where,
    include: [
      {
        model: Commentattachment,
        as: 'attachments',
      },
    ],
  });

  const resultComments = comments?.map((comment: CommentFromDBType) =>
    convertAttchmentsInComment(comment)
  );

  return resultComments;
};

export const uploadCommentAttachement = async (payload: object) => {
  let attachment;

  try {
    attachment = await Commentattachment.create(payload);
  } catch (error) {
    throw new ResourceNotFoundError('Comment');
  }

  return new CommentAttachmentDto(attachment);
};
