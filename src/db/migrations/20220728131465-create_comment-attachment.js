/* eslint-disable no-undef */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('commentattachments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      type: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(10),
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      comment_id: {
        allowNull: false,
        references: {
          model: 'comments',
          key: 'id',
        },
        type: Sequelize.DataTypes.UUID,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('commentattachments');
  },
};
