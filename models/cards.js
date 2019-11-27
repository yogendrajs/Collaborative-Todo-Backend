"use strict";
module.exports = (sequelize, DataTypes) => {
    // console.log('this is here', sequelize);
    const cards = sequelize.define(
        "cards",
        {
            cardId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            cardName: DataTypes.STRING,
            createdBy: DataTypes.STRING,
            creatorEmail: DataTypes.STRING,
            created_at: DataTypes.STRING
        },
        {
            freezeTableName: true,
            timestamps:false
        }
    );
    cards.associate = function(models) {
        // associations can be defined here
    };
    return cards;
};
