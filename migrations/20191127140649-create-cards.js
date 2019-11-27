'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cards', {
      cardId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cardName: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.STRING
      },
      creatorEmail: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cards');
  }
};