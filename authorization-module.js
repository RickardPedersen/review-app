const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.accessToken;
    if (token == null) {
        console.log('no token')
        next();
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log('invalid token')
                next();
            } else {
                console.log('YOU ARE AUTHORIZED')
                req.user = user;
                next();
            }
        });
    }
}

module.exports = authenticateToken;
