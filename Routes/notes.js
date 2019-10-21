let checkToken = require("../middleware");
const config = require("../config").envdata;

module.exports = function(notes, knex, jwt) {
    notes.post("/notes", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                console.log(req.body);
                var wholeUpdateData = authData.allData;
                knex("secret")
                    .update({ note: req.body.note })
                    .where("secret.id", req.body.noteId)
                    .then(() => {
                        knex("secret")
                            .where("secret.cardId", req.body.clickedCardIndex)
                            .andWhere(function() {
                                this.where(
                                    "secret.assignedBy",
                                    wholeUpdateData.email
                                ).orWhere(
                                    "secret.assignedTo",
                                    wholeUpdateData.email
                                );
                            })
                            .then(data => {
                                res.send(data);
                                console.log(data);
                            })
                            .catch(err => {
                                console.log(err.message);
                            });
                    });
            } else {
                console.log("note err", err);
                res.json("token is not valid");
            }
        });
    });
};
