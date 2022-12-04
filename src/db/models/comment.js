import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'comment',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });
    Comment.belongsTo(models.Task, {
      onDelete: 'cascade',
      foreignKey: 'task_id',
    });
    Comment.hasMany(models.Commentattachment, {
      onDelete: 'cascade',
      foreignKey: 'comment_id',
      as: 'attachments',
    });
  };

  return Comment;
};
