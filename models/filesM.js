module.exports = (sequelize, type) => {
    return sequelize.define("files", {
        fileId: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		todoId: type.STRING,
		userId: type.STRING,
		fileName: type.STRING,
		fileType: type.STRING,
		fileLink: type.STRING
    },
    {
        freezeTableName: true,
        timestamps: false
    });
};
