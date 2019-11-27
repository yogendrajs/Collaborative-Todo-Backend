'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comment', {
      commentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      todoId: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comment');
  }
};