const Sequelize = require("sequelize");
// const AuthorModel = require("./models/author");
// const BookModel = require("./models/book");
const authModel = require('./models/authM');
const cardsModel = require('./models/cardsM');
const commentModel = require('./models/commentM');
const filesModel = require('./models/filesM');
const replyModel = require('./models/replyM');
const secretModel = require('./models/secretM');

const { DB_NAME, DB_ME, DB_PASS, DB_HOST, DIALECT } = require("./config").envdata;
console.log(DB_NAME);

const sequelize = new Sequelize(DB_NAME, DB_ME, DB_PASS, {
    host: DB_HOST,
    dialect: DIALECT,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

const Auth = authModel(sequelize, Sequelize);
const Cards = cardsModel(sequelize, Sequelize);
const Comment = commentModel(sequelize, Sequelize);
const Files = filesModel(sequelize, Sequelize);
const Reply = replyModel(sequelize, Sequelize);
const Secret = secretModel(sequelize, Sequelize);

// Author has Many books
// Author.hasMany(Book);
sequelize.sync({ force: false }).then(() => {
    console.log(`Database & tables created here!`);
});

module.exports = {
    Auth,
	Cards,
	Comment,
	Files,
	Reply,
    Secret,
    Sequelize
};
