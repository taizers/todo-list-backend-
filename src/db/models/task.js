export default (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'task',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
    }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.Project, {
      onDelete: 'cascade',
      foreignKey: 'project_id',
    });
    Task.hasMany(models.Taskattachment, {
      onDelete: 'cascade',
      foreignKey: 'task_id',
      as: 'attachments',
    });
    Task.hasMany(models.Comment, {
      onDelete: 'cascade',
      foreignKey: 'task_id',
    });
    Task.belongsToMany(models.User, {
      onDelete: 'cascade',
      through: 'task_members',
      as: 'members',
    });
  };

  return Task;
};