import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Note = sequelize.define(
    'note',
    {
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(7),
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
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        }
      },
    }
  );

  Note.associate = (models) => {
    Note.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });
  };

  return Note;
};
