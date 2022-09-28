export default (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'token',
    {
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'owner_id',
    });
  };

  return Token;
};
