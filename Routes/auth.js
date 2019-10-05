const config = require('../config').envdata;
var verifier = require('google-id-token-verifier');

module.exports = function(auth, knex, jwt) {
    auth.post('/login', (req, res) => {

        let { email, password } = req.body;
        console.log('this is', req.body);
        knex('user')
        .where('user.email', email)
        .andWhere('user.password', password)
        .then(data => {
            if (data.length > 0){
                console.log('auth', data[0]);
                jwt.sign({allData: (data[0])}, config.SECRET, { expiresIn: '1h' }, (err, token) => {
                    if (!err){
                        data[0].token = token;
                        res.send(data);
                        // res.send(data);
                    }else {
                        console.log('this', err);
                    }
                })
            }else {
                console.log('user doesn\'t exist');
                res.send(data);
            }
        })
        .catch(err => console.log('use', err));
    })

    auth.post('/googleSignIn', (req, res) => {
        // console.log(req.body.id_token);
        let IdToken = req.body.tokenObj.id_token;
        // console.log(req.body.imgUrl);
        var clientId = config.GOOGLE_CLIENT_ID;
        verifier.verify(IdToken, clientId, function (err, tokenInfo) {
            if (!err) {
              // use tokenInfo in here.
            //   console.log(tokenInfo.given_name, tokenInfo.family_name, tokenInfo.email);

              knex('user')
                .where('user.firstName', tokenInfo.given_name)
                .andWhere('user.email', tokenInfo.email)
                .then(data => {
                      console.log(data)
                    if (data.length > 0){
                        data[0].imgUrl = req.body.imgUrl;
                        jwt.sign({allData: (data[0])}, config.SECRET, { expiresIn: '1d' }, (err, token) => {
                            if (!err){
                                data[0].token = token;
                                data[0].imgUrl = req.body.imgUrl;
                                // console.log('this is working!', data);
                                res.send(data);
                                // res.send(data);
                            }else {
                                console.log(err);
                            }
                        })
                    }
                    else {                        
                        let finalSignUpDetails = {firstName: tokenInfo.given_name, lastName: tokenInfo.family_name, email: tokenInfo.email, password: undefined}
                        // console.log('finalS', finalSignUpDetails);

                        knex('user')
                        .insert(finalSignUpDetails)
                        .then(() => {
                            console.log('data-inserted!');
                            knex('user')
                            .where('user.firstName', tokenInfo.given_name)
                            .andWhere('user.email', tokenInfo.email)
                            .then(data => {
                                jwt.sign({allData: (data[0])}, config.SECRET, { expiresIn: '1d' }, (err, token) => {
                                    if (!err){
                                        data[0].token = token;
                                        console.log('this is working!', data);
                                        res.send(data);
                                        // res.send(data);
                                    }else {
                                        console.log(err);
                                    }
                                })
                            })
                            .catch(err => console.log(err));
                        })
                        .catch(err => {
                            console.log(err);
                            res.send(err);
                        });
                    }
                })
                .catch(err => console.log(err));
            }
            else {
                console.log('error verifying token', err);
            }
        });
    })
}