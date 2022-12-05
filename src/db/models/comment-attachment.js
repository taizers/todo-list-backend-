import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Commentattachment = sequelize.define('commentattachment', {
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
        return moment(this.getDataValue('created_at')).format(
          'YYYY-MM-DD[T]HH:mm:ss.SSS'
        );
      },
    },
  });

  Commentattachment.associate = (models) => {
    Commentattachment.belongsTo(models.Comment, {
      onDelete: 'cascade',
      foreignKey: 'comment_id',
    });
  };

  return Commentattachment;
};
