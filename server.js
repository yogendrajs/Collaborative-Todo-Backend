const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const configData = require("./config");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const cors = require("cors");
const _ = require("underscore");
var multer = require("multer");
var AWS = require("aws-sdk");
var multerS3 = require("multer-s3");
var path = require("path");
const Sequelize = require('sequelize');
// const { Auth, Cards, Comment, Files, Reply, Secret, Sequelize } = require("./sequelize");
const { PORT } = configData.envdata;
const Op = Sequelize.Op;
app.use(express.json());
// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:5000'
//  }));

const Auth = require('./models').user;
const Cards = require('./models').cards;
const Comment = require('./models').comment;
const Files = require('./models').files;
const Reply = require('./models').reply;
const Secret = require('./models').secret;
// const data = require('./models/index');
// console.log(data);
console.log(Auth, Cards, Comment, Files, Reply, Secret);

app.use(cors());

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
// increase the limit
myEmitter.setMaxListeners(100);
myEmitter.emit("event");

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

app.get("/hello", (req, res) => {
    Secret.findAll().then(auth => res.json(auth));
});

var todo = express.Router();
require("./Routes/todo")(todo, jwt, Auth, Cards, Secret, Op);
app.use("/", todo);

var auth = express.Router();
require("./Routes/auth")(auth, jwt, Auth);
app.use("/", auth);

var signup = express.Router();
require("./Routes/signup")(signup, jwt, Auth);
app.use("/", signup);

var forgotPass = express.Router();
require("./Routes/forgotPass")(forgotPass, nodeoutlook, jwt, Auth);
app.use("/", forgotPass);

var resetPass = express.Router();
require("./Routes/resetPass")(resetPass, jwt, Auth);
app.use("/", resetPass);

var profile = express.Router();
require("./Routes/profile")(profile, jwt);
app.use("/", profile);

var cards = express.Router();
require("./Routes/cards")(cards, jwt, _, Cards, Secret, Op);
app.use("/", cards);

var notes = express.Router();
require("./Routes/notes")(notes, jwt, Secret);
app.use("/", notes);

var files = express.Router();
require("./Routes/files")(files, jwt, multer, multerS3, AWS, path, Files);
app.use("/", files);

var comment = express.Router();
require("./Routes/comment")(comment, jwt, Comment, Reply);
app.use("/", comment);

app.listen(PORT, () => {
    console.log(`your app is listening at port ${PORT}`);
});
