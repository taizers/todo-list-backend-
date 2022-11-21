/* eslint-disable no-undef */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      owner_id: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
      },
      project_id: {
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        type: Sequelize.DataTypes.UUID,
      },
      assigned_to: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DataTypes.UUID,
      },
      title: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      is_completed: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      due_date: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
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
    return queryInterface.dropTable('tasks');
  },
};
