const config = require("../config").envdata;
var verifier = require("google-id-token-verifier");

module.exports = function(signup, jwt, Auth) {
    signup.post("/signup", (req, res) => {
        // console.log(req.body);
        Auth.create(req.body)
            .then(data => {
                data = data.dataValues;
                console.log("kya", data);
                res.send(data);
            })
            .catch(err => {
                console.log(err);
                res.send(err.name);
            });
    });

    signup.post("/googleSignUp", (req, res) => {
        // console.log(req.body);
        // let signupData = req.body;
        // if (req.body.familyName == undefined) {
        //     signupData.familyName = undefined;
        // }
        // let finalSignUpDetails = {
        //     firstName: signupData.givenName,
        //     lastName: signupData.familyName,
        //     email: signupData.email,
        //     password: undefined
        // };

        // Auth.findOrCreate({
        //     where: {
        //         firstName: signupData.given_name,
        //         email: signupData.email
        //     },
        //     defaults: finalSignUpDetails,
        //     raw: true
        // })
        //     .then(([exist, create]) => {
        //         console.log("manual", exist);
        //         console.log("mau", create);

        //         let data = exist;
        //         if (create) {
        //             data = exist.dataValues;
        //         }

        //         jwt.sign(
        //             { allData: data },
        //             config.SECRET,
        //             { expiresIn: "1d" },
        //             (err, token) => {
        //                 if (!err) {
        //                     data.token = token;
        //                     // data.imgUrl = req.body.imgUrl;
        //                     // console.log('this is working!', data);
        //                     res.send(data);
        //                     // res.send(data);
        //                 } else {
        //                     console.log(err);
        //                 }
        //             }
        //         );
        //     })
        //     .catch(err => console.log(err));
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
