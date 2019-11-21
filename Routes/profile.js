const checkToken = require('../middleware');
const config = require('../config').envdata;

module.exports = function(profile, jwt) {
    profile.post('/profile', checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let userData = authData.allData;
                console.log('pro', userData);
                if (!userData.hasOwnProperty('imgUrl')){
                    userData.imgUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLow_IPNDld2elH-g6Sqgpy1KGCh3RAd_78dRXPPejqaJDAiuI'
                }

                if (userData.lastName !== null){
                    var myPersonal = {name: `${userData.firstName} ${userData.lastName}`, email: userData.email, avatar: userData.firstName[0], imgUrl: userData.imgUrl};
                    // console.log(myPersonal);
                }
                else {
                    myPersonal = {name: `${userData.firstName}`, email: userData.email, avatar: userData.firstName[0], imgUrl: userData.imgUrl};
                    console.log(myPersonal);
                }
                res.send(myPersonal);
            }
            else console.log(err);
        })
    })
}