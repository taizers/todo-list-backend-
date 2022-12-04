import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Checklist = sequelize.define(
    'checklist',
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

  Checklist.associate = (models) => {
    Checklist.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });
    Checklist.hasMany(models.Checklistitem, {
      onDelete: 'cascade',
      as: 'items',
      foreignKey: 'checklist_id',
    });
  };

  return Checklist;
};
