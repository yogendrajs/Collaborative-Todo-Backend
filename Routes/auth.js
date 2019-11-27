const config = require("../config").envdata;
var verifier = require("google-id-token-verifier");

module.exports = function(auth, jwt, Auth) {
    
    auth.post("/login", (req, res) => {
        let { email, password } = req.body;
        Auth.findOne({
            where: {
                email: email,
                password: password
            },
            raw: true
        })
            .then((data) => {
                if (data === null) {
                    res.send('SequelizeUniqueConstraintError');
                    return;
                }
                jwt.sign(
                    { allData: data },
                    config.SECRET,
                    { expiresIn: "1h" },
                    (err, token) => {
                        if (!err) {
                            data.token = token;
                            res.send(data);
                            // res.send(data);
                        } else {
                            console.log("jwt error", err);
                        }
                    }
                );
            })
            .catch(err => {
                console.log(err);
                res.json(err.name);
            });
    });

    auth.post("/googleSignIn", (req, res) => {
        // console.log(req.body.id_token);
        let IdToken = req.body.tokenObj.id_token;
        // console.log(req.body.imgUrl);
        var clientId = config.GOOGLE_CLIENT_ID;
        verifier.verify(IdToken, clientId, function(err, tokenInfo) {
            if (!err) {
                // use tokenInfo in here.
                //   console.log(tokenInfo.given_name, tokenInfo.family_name, tokenInfo.email);
                let finalSignUpDetails = {
                    firstName: tokenInfo.given_name,
                    lastName: tokenInfo.family_name,
                    email: tokenInfo.email,
                    password: undefined
                };

                console.log(finalSignUpDetails);
                Auth.findOrCreate({
                    where: {
                        firstName: tokenInfo.given_name,
                        email: tokenInfo.email
                    },
                    defaults: finalSignUpDetails,
                    raw: true
                })
                .then(([exist, create]) => {
                    console.log("manual", exist);
                    console.log("mau", create);

                    let data = exist;
                    if (create) {
                        data = exist.dataValues;
                    }

                    jwt.sign(
                        { allData: data },
                        config.SECRET,
                        { expiresIn: "1d" },
                        (err, token) => {
                            if (!err) {
                                data.token = token;
                                data.imgUrl = req.body.imgUrl;
                                // console.log('this is working!', data);
                                res.send(data);
                                // res.send(data);
                            } else {
                                console.log(err);
                            }
                        }
                    );
                })
                .catch(err => console.log('yahi hai yrr', err));
            } else {
                console.log("error verifying token", err);
            }
        });
    });
};
