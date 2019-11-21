let config = require("../config").envdata;
let checkToken = require("../middleware");

module.exports = function(comment, jwt, Comment, Reply) {
    comment.post("/postcomment", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let { userId, firstName } = authData.allData;
                let { todoId, comment, time } = req.body;
                // console.log(todoId, comment, userId, firstName);

                Comment.create({
                    todoId: todoId,
                    comment: comment,
                    userId: userId,
                    firstName: firstName,
                    time: time
                })
                .then(() => {
                    // console.log('hahas', commentData.dataValues);
                    Comment.findAll()
                    .then(commentData => {
                        // console.log(commentData);
                        res.json(commentData);
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => {
                    console.log('comment err', err);
                })

            } else {
                console.log("token err", err);
                res.json("token is not valid");
            }
        });
    });

    comment.get("/allcomments", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                Comment.findAll()
                    .then(commentData => {
                        // console.log(commentData);
                        res.json(commentData);
                    })
                    .catch(err => console.log(err));
            } else {
                console.log("token err", err);
                res.json("token is not valid");
            }
        });
    });

    comment.post("/addreply", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let { userId, firstName } = authData.allData;
                let { parentCommentId, todoId, reply, time } = req.body;
                // console.log(parentCommentId, todoId, reply);

                Reply.create({
                    todoId: todoId,
                    commentId: parentCommentId,
                    reply: reply,
                    userId: userId,
                    firstName: firstName,
                    time: time
                })
                .then(() => {
                    Reply.findAll()
                    .then(allreplies => {
                        // console.log(allreplies);
                        res.json(allreplies);
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));

            } else {
                console.log("token err", err);
                res.json("token is not valid");
            }
        });
    });

    comment.get("/allreplies", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                Reply.findAll()
                    .then(allreplies => {
                        // console.log(allreplies);
                        res.json(allreplies);
                    })
                    .catch(err => console.log(err));
            } else {
                console.log("token err", err);
                res.json("token is not valid");
            }
        });
    });
};
