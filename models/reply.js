"use strict";
module.exports = (sequelize, DataTypes) => {
    const reply = sequelize.define(
        "reply",
        {
            commentId: DataTypes.STRING,
            todoId: DataTypes.STRING,
            reply: DataTypes.STRING,
            userId: DataTypes.STRING,
            firstName: DataTypes.STRING,
            time: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps:false
        }
    );
    reply.associate = function(models) {
        // associations can be defined here
    };
    reply.removeAttribute('id');
    return reply;
};
