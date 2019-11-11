const jwt = require('jsonwebtoken'),
    jwtConfig = require('../../config/jwt.config.js');

module.exports.verifyToken = function (req, res, next) {
    let tokenCookies = req.cookies["x-access-token"];
    let tokenHeader = req.headers["x-access-token"];
    if (tokenCookies) {
        jwt.verify(tokenCookies, jwtConfig.configs.jwtSecretKey, function (err, decoded) {
            if (err) {
                if(req.method==="POST"){
                    res.json({status: false, message: err})
                } else {
                    res.redirect('/login');
                }
            } else {
                next()
            }
        });
    } else if(tokenHeader){
        jwt.verify(tokenHeader, jwtConfig.configs.jwtSecretKey, function (err, decoded) {
            if (err) {
                if(req.method==="POST"){
                    res.json({status: false, message: err})
                } else {
                    res.redirect('/login');
                }
            } else {
                next()
            }
        });
    }else {
        if(req.method==="POST"){
            res.json({status: false, message: "Token not found."})
        } else {
            res.redirect('/login');
        }
    }
};