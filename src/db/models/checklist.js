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
      created_at: {
        type: DataTypes.DATE,    
        allowNull: false,            
        get() {
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD[T]HH:mm:SSS');
        }
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
