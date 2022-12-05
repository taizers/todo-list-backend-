import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Checklistitem = sequelize.define('checklistitem', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  Checklistitem.associate = (models) => {
    Checklistitem.belongsTo(models.Checklist, {
      onDelete: 'cascade',
      foreignKey: 'checklist_id',
    });
  };

  return Checklistitem;
};
