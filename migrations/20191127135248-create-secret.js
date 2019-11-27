"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("secret", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            item: {
                type: Sequelize.STRING
            },
            done: {
                type: Sequelize.BOOLEAN
            },
            assignedTo: {
                type: Sequelize.STRING
            },
            assignedToName: {
                type: Sequelize.STRING
            },
            assignedBy: {
                type: Sequelize.STRING
            },
            assignedByName: {
                type: Sequelize.STRING
            },
            cardId: {
                type: Sequelize.STRING
            },
            note: {
                type: Sequelize.STRING
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("secret");
    }
};
