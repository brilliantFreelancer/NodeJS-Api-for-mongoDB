let userModel = require('../model/user.model.js');
const jwtConfig = require('../../config/jwt.config');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


module.exports.validatelogin = function (req, res) {
    
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.assert('userName', 'Username cannot be blank').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        return res.json({status: false, errors: errors, message: errors});
    }
    let insensitive_userName = new RegExp(["^", req.body.userName, "$"].join(""), "i");
    // find the user
    userModel.findOne({
        Username: insensitive_userName
    }, function (err, user) {
        if (!user || err) {
            return res.json({success: false, message: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.json({status: false, message: 'Authentication failed. Wrong password.'});
                } else {
                    const payload = {
                        id: user.id,
                        Username: user.username
                    };
                    jwt.sign(payload, jwtConfig.configs.jwtSecretKey, {expiresIn: jwtConfig.configs.jwtExpire}, (err, token) => {
                        if (!err) {
                            res.cookie('x-access-token', token, {
                                maxAge: jwtConfig.configs.sessionExpire,
                                path: '/',
                                secure: true,
                                httpOnly: true
                            }).json({message: 'User Authentication Successful.', status: true, token: token});
                        } else {
                            res.json({message: 'User Authentication Failed.', status: false}).status(403);
                        }

                    });
                }
            });
        }

    });
};


module.exports.logout = function (req, res){
    res.clearCookie("x-access-token").redirect('/');
}

