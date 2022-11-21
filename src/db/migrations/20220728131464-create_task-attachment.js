/* eslint-disable no-undef */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('taskattachments', {
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
      task_id: {
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id',
        },
        type: Sequelize.DataTypes.UUID,
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
    return queryInterface.dropTable('taskattachments');
  },
};
