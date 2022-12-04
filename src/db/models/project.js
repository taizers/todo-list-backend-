import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'project',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(7),
        allowNull: false,
      },
    }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });
    Project.hasMany(models.Task, {
      onDelete: 'cascade',
      foreignKey: 'project_id',
    });
  };

  return Project;
};
