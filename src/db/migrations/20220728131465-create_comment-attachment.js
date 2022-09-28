/* eslint-disable no-undef */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('commentattachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
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
        type: Sequelize.DataTypes.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      deleted_at: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('commentattachments');
  },
};
