let checkToken = require('../middleware');
const config = require('../config').envdata;
// console.log(config);

module.exports = function(resetPass, knex, jwt) {
    resetPass.post('/resetpass', checkToken, (req, res) => {
        let token = req.body.token;
        console.log('token', token);

        if (token !== undefined){
            jwt.verify(req.token, config.SECRET, (err, authData) => {
                if (!err){
                    console.log('sahi hai');
                }else {
                    if (err.message === 'jwt expired'){
                        return res.send(false);
                    }
                }
            })
            return;
        }
        // console.log('false hai ')
        return res.send(false)
    })

    resetPass.post('/submitNewPass', checkToken, (req, res) => {
        let newPass = { password: req.body.password };
        console.log(newPass);
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            console.log(authData);
            if (authData === undefined){
                return res.send(false);
            }
            let tokenData = JSON.parse(authData.allData);

            if (!err) {
                knex('user')
                .update(newPass)
                .where('email', tokenData.email)
                .andWhere('user.userId', tokenData.userId)
                .then(() => {
                    console.log('password updated!');
                    return res.send(true);
                })
                .catch(err => console.log(err));

            }else {
                console.log(err);
            }
        })
    })
}