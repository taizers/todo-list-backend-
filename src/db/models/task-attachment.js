import moment from 'moment';

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
      created_at: {
        type: DataTypes.DATE,    
        allowNull: false,            
        get() {
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        }
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
