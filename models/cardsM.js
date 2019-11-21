module.exports = (sequelize, type) => {
    return sequelize.define("cards", {
        cardId: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		cardName: type.STRING,
		createdBy: type.STRING,
		creatorEmail: type.STRING,
		created_at: type.STRING
    },
    {
        freezeTableName: true,
        timestamps: false
    });
};

