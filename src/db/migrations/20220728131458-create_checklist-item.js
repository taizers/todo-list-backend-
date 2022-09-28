/* eslint-disable no-undef */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('checklistitems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      checklist_id: {
        allowNull: false,
        references: {
          model: 'checklists',
          key: 'id',
        },
        type: Sequelize.DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      is_completed: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.DataTypes.BOOLEAN,
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
    return queryInterface.dropTable('checklistitems');
  },
};
