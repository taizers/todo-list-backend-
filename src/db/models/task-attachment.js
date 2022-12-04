export default (sequelize, DataTypes) => {
  const Taskattachment = sequelize.define(
    'taskattachment',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    }
  );

  Taskattachment.associate = (models) => {
    Taskattachment.belongsTo(models.Task, {
      onDelete: 'cascade',
      foreignKey: 'task_id',
    });
  };

  return Taskattachment;
};
