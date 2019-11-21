let checkToken = require("../middleware");
let config = require("../config").envdata;

module.exports = function(cards, jwt, _, Cards, Secret, Op) {
    cards.post("/cards", checkToken, (req, res) => {
        // console.log(req.body);
        let options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        let { token, cardName } = req.body;
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let tokenData = authData.allData;
                // console.log(tokenData, cardName);
                let insertionData = {
                    createdBy: tokenData.firstName,
                    creatorEmail: tokenData.email,
                    cardName: cardName,
                    created_at: new Date().toLocaleDateString("en-US", options)
                };

                Cards.create(insertionData)
                    .then(() => {
                        Cards.findAll({
                            where: {
                                creatorEmail: tokenData.email
                            }
                        })
                            .then(cardData => {
                                Secret.findAll({
                                    where: {
                                        [Op.or]: [
                                            { assignedBy: tokenData.email },
                                            { assignedTo: tokenData.email }
                                        ]
                                    }
                                })
                                    .then(assigneeData => {
                                        Promise.all(
                                            assigneeData.map(f => {
                                                return Cards.findAll({
                                                    where: {
                                                        cardId: f.cardId
                                                    },
                                                    raw: true
                                                })
                                                    .then(finalhai => {
                                                        return finalhai[0];
                                                    })
                                                    .catch(err =>
                                                        console.log(err)
                                                    );
                                            })
                                        ).then(response => {
                                            let wholeCards = response.concat(
                                                cardData
                                            );
                                            var myArray = _.uniq(
                                                wholeCards,
                                                "cardId"
                                            );
                                            console.log("last array", myArray);
                                            res.send(myArray);
                                        });
                                    })
                                    .catch(err => console.log(err));
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));

            } else {
                console.log(err.message);
                res.send("token is not valid");
            }
        });
    });

    cards.get("/allCards", checkToken, (req, res) => {
        // let { token } = req.query;
        // console.log(token, 'and\n', req.token );
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let tokenData = authData.allData;

                Cards.findAll({
                    where: {
                        creatorEmail: tokenData.email
                    }
                })
                    .then(cardData => {
                        Secret.findAll({
                            where: {
                                [Op.or]: [
                                    { assignedBy: tokenData.email },
                                    { assignedTo: tokenData.email }
                                ]
                            }
                        })
                            .then(assigneeData => {
                                Promise.all(
                                    assigneeData.map(f => {
                                        return Cards.findAll({
                                            where: {
                                                cardId: f.cardId
                                            },
                                            raw: true
                                        })
                                            .then(allCardsData => {
                                                return allCardsData[0];
                                            })
                                            .catch(err => console.log(err));
                                    })
                                )
                                    .then(response => {
                                        let wholeCards = response.concat(
                                            cardData
                                        );
                                        var myArray = _.uniq(
                                            wholeCards,
                                            "cardId"
                                        );
                                        console.log("last arrays", myArray);
                                        res.send({
                                            loggedInUser: tokenData.firstName,
                                            myArray: myArray
                                        });
                                    })
                                    .catch(err =>
                                        console.log("promise err", err)
                                    );
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));

            } else {
                console.log(err.message);
                res.send("token is not valid");
            }
        });
    });
};
