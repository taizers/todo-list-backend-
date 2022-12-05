import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue('created_at')).format(
          'YYYY-MM-DD[T]HH:mm:ss.SSS'
        );
      },
    },
  });

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
