export default (sequelize, DataTypes) => {
  const Checklistitem = sequelize.define(
    'checklistitem',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }
  );

  Checklistitem.associate = (models) => {
    Checklistitem.belongsTo(models.Checklist, {
      onDelete: 'cascade',
      foreignKey: 'checklist_id',
    });
  };

  return Checklistitem;
};
