let checkToken = require('../middleware');
require('dotenv').config();

module.exports = function(todo, jwt, Auth, Cards, Secret, Op){
    todo.get('/get', checkToken, (req,res)=>{
        // console.log('params', req.query);
        jwt.verify(req.token, process.env.SECRET, function(err, authData) {
            if(!err){
                var userData = authData.allData;

                Secret.findAll({
                    where: {
                        cardId: req.query.clickedCardIndex
                    },
                    $and: {
                        where: {
                            assignedBy: userData.email
                        },
                        $or: {
                            assignedTo: userData.email
                        }
                    },
                    raw: true
                })
                .then(data => {
                    // console.log('my pls call', data);
                    if (data.length === 0){
                        Cards.findAll({
                            where: {
                                creatorEmail: userData.email,
                                cardId: req.query.clickedCardIndex
                            }
                        })
                        .then(cardData => {
                            if (cardData.length === 0) {
                                res.send('Invalid Card');
                            }
                            else {
                                return res.send({data: data, avatar: userData.firstName});
                            }
                        })
                        .catch(err => console.log(err));
                        return;
                    }
                    return res.send({data: data, avatar: userData.firstName});
                })
                .catch(err => console.log(err.message))
            }
            else{
                console.log(err);
                res.json('token is not valid')
            }
        });
    })

    todo.post('/post', checkToken, (req,res)=>{
        console.log(req.body);
        var data = { item: req.body.item, done: req.body.done, assignedTo: req.body.assignedTo, cardId: req.body.clickedCardIndex };

        jwt.verify(req.token, process.env.SECRET, (err, authData)=>{
            if(!err){
                data.userId = authData.allData.userId;
                Auth.findOne({
                    where: {
                        email: data.assignedTo
                    },
                    raw: true
                })
                .then(userExist => {
                    if (userExist !== null) {
                        let userData = authData.allData;
                        
                        Auth.findOne({
                            where: {
                                email: data.assignedTo
                            }
                        })
                        .then(assigneeDetails => {
                            data.assignedByName = userData.firstName;
                            data.assignedBy = userData.email;
                            data.assignedToName = assigneeDetails.firstName;

                            // console.log(data);
                            Secret.create(data)
                            .then(() => {
                                Secret.findAll({
                                    where: {
                                        cardId: data.cardId,
                                    },
                                    $and: {
                                        where: {
                                            [Op.or]: [{assignedBy: data.assignedBy}, {assignedTo: data.assignedBy}]
                                        }
                                    },
                                    raw: true
                                })
                                .then(finaldata => {
                                    console.log('aakhir', finaldata)
                                    res.send(finaldata);
                                })
                                .catch(err => console.log(err));
                            })
                        })
                    }
                    else {
                        res.send(null);
                    }
                })
                .catch(err => console.log(err));
            }
            else{
                console.log(err);
                res.json('token is not valid')
            }
        })    
    })

    todo.put('/update/:id', checkToken, (req,res)=>{
        // var id = parseInt(req.params.id)+1;
        console.log('original',req.params.id)
        jwt.verify(req.token, process.env.SECRET, function(err, authData){
            if(!err){
                var wholeUpdateData = authData.allData;
                Secret.update({item: req.body.editItem},{
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => {
                    Secret.findAll({
                        where: {
                            cardId: req.body.clickedCardIndex
                        },
                        $and: {
                            [Op.or]: [{assignedBy: wholeUpdateData.email}, {assignedTo: wholeUpdateData.email}]
                        }
                    })
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => console.log(err.message));
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            }
            else{
              res.json('token is not valid')
            }
        })
    })

    todo.put('/checkbox', checkToken, (req,res) =>{
        console.log(req.body.id)
        jwt.verify(req.token, process.env.SECRET, (err,authData) =>{
            if(!err){
                // var userId = authData.allData.userId;
                var wholeUpdateData = authData.allData;

                Secret.update({done: req.body.done}, {
                    where: {
                        id: req.body.id
                    }
                })
                .then(() => {
                    Secret.findAll({
                        where: {
                            cardId: req.body.clickedCardIndex
                        },
                        $and: {
                            [Op.or]: [{assignedBy: wholeUpdateData.email}, {assignedTo: wholeUpdateData.email}]
                        }
                    })
                    .then(data => {
                        res.send(data);
                    })
                    .catch((err)=>{
                        console.log(err.message)
                    })
                })
                .catch((err) => console.log(err.message))
            }
            else{
                console.log(err);
                res.json('token is not valid')
            }
        })
    })

    todo.delete('/delete/:id', checkToken, (req,res) =>{
        jwt.verify(req.token, process.env.SECRET, (err, authData) =>{
            if(!err){
                // var userId = authData.allData.userId;
                var wholeUpdateData = authData.allData;

                Secret.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => {
                    Secret.findAll({
                        where: {
                            cardId: req.body.clickedCardIndex
                        },
                        $and: {
                            [Op.or]: [{assignedBy: wholeUpdateData.email}, {assignedTo: wholeUpdateData.email}]
                        }
                    })
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => console.log(err.message))
                })
                .catch(err => console.log(err))
            }
            else{
                console.log(err);
                res.json('token is not valid')
            }
        })
    })
}