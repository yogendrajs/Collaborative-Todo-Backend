let checkToken = require("../middleware");
const config = require("../config").envdata;

module.exports = function(notes, jwt, Secret) {
    notes.post("/notes", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                console.log(req.body);
                var wholeUpdateData = authData.allData;

                Secret.update({ note: req.body.note }, {
                    where: {
                        id: req.body.noteId
                    }
                })
                .then(() => {
                    Secret.findAll({
                        where: {
                            cardId: req.body.clickedCardIndex
                        },
                        $and: {
                            where: {
                                assignedBy: wholeUpdateData.email
                            },
                            $or: {
                                assignedTo: wholeUpdateData.email
                            }
                        },
                        raw: true
                    })
                    .then(data => {
                        // console.log('filhall', data);
                        res.send(data);
                    })
                    .catch(err => console.log(err));
                })
            } else {
                console.log("note err", err);
                res.json("token is not valid");
            }
        });
    });
};
