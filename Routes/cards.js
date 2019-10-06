let checkToken = require('../middleware');
let config = require('../config').envdata;

module.exports = function(cards, knex, jwt, _) {
    cards.post('/cards', checkToken,  (req, res) => {
        // console.log(req.body);
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let { token, cardName } = req.body;
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err){
                let tokenData = (authData.allData);
                // console.log(tokenData, cardName);
                let insertionData = {createdBy: tokenData.firstName, creatorEmail: tokenData.email, cardName: cardName, created_at: (new Date()).toLocaleDateString("en-US", options)};
                knex('cards')
                .insert(insertionData)
                .then(() => {
                    knex('cards')
                    .where('cards.creatorEmail', tokenData.email)
                    .then(cardData => {
                        // console.log('cd', cardData);
                        knex('secret')
                        .where('secret.assignedTo', tokenData.email)
                        .orWhere('secret.assignedBy', tokenData.email)
                        .then(assigneeData => {
                            // console.log('ad', assigneeData);
                            Promise.all(assigneeData.map(f => {
                                // console.log(f.cardId);
                                return knex('cards')
                                .where('cards.cardId', f.cardId)
                                .then(finalhai => {
                                    // console.log(finalhai)
                                    return finalhai[0];
                                    
                                })
                                .catch(err => console.log(err))
                                // return f.cardId;

                            })).then(response => {
                                let wholeCards = response.concat(cardData);
                                var myArray = _.uniq(wholeCards, 'cardId');
                                console.log(myArray);
                                res.send(myArray);
                            });
                            
                            // res.send({cardData: cardData, assigneeData: assigneeData});
                        })
                        .catch(err => console.log(err));

                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            }
            else {
                console.log(err.message);
                res.send('token is not valid');
            }
        })
    })

    cards.get('/allCards', checkToken, (req, res) => {
        // let { token } = req.query;
        // console.log(token, 'and\n', req.token );
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let tokenData = authData.allData;
                knex('cards')
                .where('cards.creatorEmail', tokenData.email)
                .then(cardData => {
                    // console.log('cd', cardData);
                    knex('secret')
                    .where('secret.assignedTo', tokenData.email)
                    .orWhere('secret.assignedBy', tokenData.email)
                    .then(assigneeData => {
                        // console.log('ad', assigneeData);
                        Promise.all(assigneeData.map(f => {
                            // console.log(f.cardId);
                            return knex('cards')
                            .where('cards.cardId', f.cardId)
                            .then(allCardsData => {
                                // console.log(allCardsData)
                                return allCardsData[0];
                                
                            })
                            .catch(err => console.log(err));
                            // return f.cardId;

                        }))
                        .then(response => {
                            let wholeCards = response.concat(cardData);
                            var myArray = _.uniq(wholeCards, 'cardId');
                            console.log(myArray);
                            res.send({ loggedInUser: tokenData.firstName, myArray: myArray });
                        })
                        .catch(err => console.log('promise err', err));                        
                        // res.send({cardData: cardData, assigneeData: assigneeData});
                    })
                    .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
            }else {
                console.log(err.message);
                res.send('token is not valid');
            }
        })
    })
}