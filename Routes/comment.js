let config = require("../config").envdata;
let checkToken = require("../middleware");

module.exports = function(comment, knex, jwt) {
    comment.post("/postcomment", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let { userId, firstName } = authData.allData;
                let { todoId, comment, time } = req.body;
                // console.log(todoId, comment, userId, firstName);
                knex("comment")
                    .insert({
                        todoId: todoId,
                        comment: comment,
                        userId: userId,
                        firstName: firstName,
                        time: time
                    })
                    .then(() => {
                        knex("comment")
                            // .where('comment.todoId', todoId)
                            // .andWhere('comment.userId', userId)
                            .then(commentData => {
                                console.log(commentData);
                                res.json(commentData);
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log("comment insertion error", err));
            } else {
                console.log("token err", err);
                res.json("token is not valid");
            }
        });
    });

    comment.get("/allcomments", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                knex("comment")
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
                knex("reply")
                    .insert({
                        todoId: todoId,
                        commentId: parentCommentId,
                        reply: reply,
                        userId: userId,
                        firstName: firstName,
                        time: time
                    })
                    .then(() => {
                        knex("reply")
                            .then(allreplies => {
                                console.log(allreplies);
                                res.json(allreplies);
                            })
                            .catch(err => console.log(err));
                    });
            } else {
                console.log("token err", err);
                res.json("token is not valid");
            }
        });
    });

    comment.get("/allreplies", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                knex("reply")
                    .then(allreplies => {
                        console.log(allreplies);
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
