module.exports = (sequelize, type) => {
    return sequelize.define("comment", {
        commentId: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		todoId: type.STRING,
		comment: type.STRING,
		userId: type.STRING,
		firstName: type.STRING,
		time: type.STRING
    },
    {
        freezeTableName: true,
        timestamps: false
    });
};
