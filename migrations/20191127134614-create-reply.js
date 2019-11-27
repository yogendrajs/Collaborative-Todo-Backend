"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("reply", {
            commentId: {
                type: Sequelize.STRING
            },
            todoId: {
                type: Sequelize.STRING
            },
            reply: {
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
        return queryInterface.dropTable("reply");
    }
};
