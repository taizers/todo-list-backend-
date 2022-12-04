export default (sequelize, DataTypes) => {
  const Commentattachment = sequelize.define(
    'commentattachment',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    }
  );

  Commentattachment.associate = (models) => {
    Commentattachment.belongsTo(models.Comment, {
      onDelete: 'cascade',
      foreignKey: 'comment_id',
    });
  };

  return Commentattachment;
};
