module.exports = (sequelize, type) => {
	return sequelize.define("secret", {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		userId: type.INTEGER,
		item: type.STRING,
		done: type.BOOLEAN,
		assignedTo: type.STRING,
		assignedToName: type.STRING,
		assignedBy: type.STRING,
		assignedByName: type.STRING,
		cardId: type.STRING,
		note: type.STRING
	},
	{
		freezeTableName: true,
		timestamps: false
	});
};