"use strict";
module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define(
        "comment",
        {
            commentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            todoId: DataTypes.STRING,
            comment: DataTypes.STRING,
            userId: DataTypes.STRING,
            firstName: DataTypes.STRING,
            time: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps:false
        }
    );
    comment.associate = function(models) {
        // associations can be defined here
    };
    return comment;
};
