// this file is for checking if the jwt-token is valid or not

let checkToken = (req, res, next) => {
    let token = req.body.token || req.query.token;

    if (typeof(token) != 'undefined') {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        req.token = token;
    }
    next();
};

module.exports = checkToken;