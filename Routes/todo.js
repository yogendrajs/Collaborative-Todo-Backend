let checkToken = require('../middleware');
require('dotenv').config();

module.exports = function(todo, knex, jwt){
    todo.get('/get', checkToken, (req,res)=>{
        // console.log('params', req.query);
        jwt.verify(req.token, process.env.SECRET, function(err, authData) {
            if(!err){
                var userData = authData.allData;

                knex('secret')
                .where('secret.cardId', req.query.clickedCardIndex)
                .andWhere(function() {
                    this.where('secret.assignedBy', userData.email)
                    .orWhere('secret.assignedTo', userData.email)
                })
                .then(data => {
                    // console.log('data', data);
                    
                    return res.send({data: data, avatar: userData.firstName});
                    // res.send(data);
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

                knex('user')
                .where('user.email', data.assignedTo)
                .then(userExist => {

                    if (userExist.length !== 0){
                        let userData = authData.allData;
                        console.log('userdata', userData);
                        data.userId = authData.allData.userId;
                        knex('user')
                        .where('user.email', data.assignedTo)
                        .then(assigneeDetails => {
                            // console.log('assign', assigneeDetails);
                            data.assignedByName = userData.firstName;
                            data.assignedBy = userData.email;
                            data.assignedToName = assigneeDetails[0].firstName;
                            // console.log(data);
                            // if (data.assignedByName === data.assignedToName){
                            //     data.assignedToName = 'me';
                            // }

                            knex('secret')
                            .insert(data)
                            .then(() => {
                                console.log('this is data', data);
                                knex('secret')
                                .where('secret.cardId', data.cardId)
                                .andWhere(function() {
                                    this.where('secret.assignedBy', data.assignedBy)
                                    .orWhere('secret.assignedTo', data.assignedBy)
                                })
                                .then(finaldata => {
                                    console.log('aakhir', finaldata);
                                    res.send(finaldata)
                                })
                                .catch(err => console.log(err.message))
                            })
                            .catch((err) => console.log(err.message))
                            
                        })
                        .catch(err => console.log(err));
                    }
                    else {
                        res.send(userExist);
                    }
                })
                .catch(err => console.log('missing', err));
                
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
                knex('secret')
                .where('secret.id', req.params.id)
                .update({
                    "item":req.body.editItem
                })
                .then(() => {

                    knex('secret')
                    .where('secret.cardId', req.body.clickedCardIndex)
                    .andWhere(function() {
                        this.where('secret.assignedBy', wholeUpdateData.email)
                        .orWhere('secret.assignedTo', wholeUpdateData.email)
                    })
                    .then(data =>{
                        res.send(data)
                    })
                    .catch((err)=>{
                        console.log(err.message)
                    })
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
                var userId = authData.allData.userId;
                var wholeUpdateData = authData.allData;

                knex('secret')
                .where("secret.id", req.body.id)
                // .andWhere('secret.userId', userId)
                .update({
                    done:req.body.done
                })
                .then(() => {

                    knex('secret')
                    .where('secret.cardId', req.body.clickedCardIndex)
                    .andWhere(function() {
                        this.where('secret.assignedBy', wholeUpdateData.email)
                        .orWhere('secret.assignedTo', wholeUpdateData.email)
                    })
                    .then(data =>{
                        res.send(data)
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

                knex('secret')
                .where('secret.id', req.params.id)
                .del()
                .then(() => {
                    
                    knex('secret')
                    .where('secret.cardId', req.body.clickedCardIndex)
                    .andWhere(function() {
                        this.where('secret.assignedBy', wholeUpdateData.email)
                        .orWhere('secret.assignedTo', wholeUpdateData.email)
                    })
                    .then(data =>{
                        res.send(data)
                    })
                    .catch((err)=>{
                        console.log(err.message)
                    })
                    
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