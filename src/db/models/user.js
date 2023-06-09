import moment from 'moment';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
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

  User.associate = (models) => {
    User.hasOne(models.Token, { onDelete: 'cascade', foreignKey: 'owner_id' });
    User.hasMany(models.Note, { onDelete: 'cascade', foreignKey: 'owner_id' });
    User.hasMany(models.Project, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });
    User.hasMany(models.Comment, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });
    User.hasMany(models.Checklist, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });

    User.belongsToMany(models.Task, {
      through: 'task_members',
      onDelete: 'cascade',
      as: 'members',
    });
  };

  return User;
};
