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
    },
    {
      paranoid: true,
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
