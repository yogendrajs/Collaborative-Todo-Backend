"use strict";
module.exports = (sequelize, DataTypes) => {
    const files = sequelize.define(
        "files",
        {
            fileId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            todoId: DataTypes.STRING,
            userId: DataTypes.STRING,
            fileName: DataTypes.STRING,
            fileType: DataTypes.STRING,
            fileLink: DataTypes.STRING,
            cloudinaryLink: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps:false
        }
    );
    files.associate = function(models) {
        // associations can be defined here
    };
    return files;
};
