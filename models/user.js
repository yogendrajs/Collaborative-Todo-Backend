"use strict";
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        "user",
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps:false
        }
    );
    user.associate = function(models) {
        // associations can be defined here
    };
    return user;
};
