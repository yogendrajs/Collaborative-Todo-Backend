"use strict";
module.exports = (sequelize, DataTypes) => {
    const secret = sequelize.define(
        "secret",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: DataTypes.INTEGER,
            item: DataTypes.STRING,
            done: DataTypes.BOOLEAN,
            assignedTo: DataTypes.STRING,
            assignedToName: DataTypes.STRING,
            assignedBy: DataTypes.STRING,
            assignedByName: DataTypes.STRING,
            cardId: DataTypes.STRING,
            note: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps:false
        }
    );
    secret.associate = function(models) {
        // associations can be defined here
    };
    return secret;
};
