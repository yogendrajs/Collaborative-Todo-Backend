module.exports = (sequelize, type) => {
    return sequelize.define("user", {
        userId: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		firstName: type.STRING,
		lastName: type.STRING,
		email: {
			type: type.STRING,
			allowNull: false,
			unique: true
		},
		password: type.STRING
    },
    {
        freezeTableName: true,
        timestamps: false
    });
};

