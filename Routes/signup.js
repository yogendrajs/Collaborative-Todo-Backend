module.exports = function(signup, knex, jwt) {
    signup.post('/signup', (req, res) => {
        console.log(req.body);
        knex('user')
        .insert(req.body)
        .then(data => {
            console.log('data-inserted!');
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
    })

    signup.post('/googleSignUp', (req, res) => {
        console.log(req.body);
        let signupData = req.body;
        if (req.body.familyName == undefined){
            signupData.familyName = undefined;
        }
        let finalSignUpDetails = {firstName: signupData.givenName, lastName: signupData.familyName, email: signupData.email, password: undefined}
        console.log(finalSignUpDetails);

        knex('user')
        .where('user.email', signupData.email)
        .then(myData => {
            if (myData.length === 0){
                knex('user')
                .insert(finalSignUpDetails)
                .then(data => {
                    console.log('data-inserted!');
                    res.send(data);
                })
                .catch(err => {
                    console.log(err);
                    res.send(err);
                });
            }else {
                jwt.sign({allData: (myData[0])}, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
                    if (!err){
                        myData[0].token = token;
                        console.log('this is working!', myData);
                        res.send(myData);
                    }else {
                        console.log(err);
                    }
                })
            }
        })
    })
}