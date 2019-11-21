module.exports = (sequelize, type) => {
    var reply = sequelize.define("reply", {
		commentId: type.STRING,
		todoId: type.STRING,
		reply: type.STRING,
		userId: type.STRING,
		firstName: type.STRING,
		time: type.STRING
    },
    {
        freezeTableName: true,
		timestamps: false
	});
	reply.removeAttribute('id');
	return reply;
};

