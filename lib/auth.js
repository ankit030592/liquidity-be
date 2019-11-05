var jwt = require('jsonwebtoken');
//var config = require('config');
var appSecret = "mysecretcode";
var tokenExpiresIn = 1440;
var tokenIssuer = "kasback";

exports.generateToken = function(user, options) {

    user.dateTime = Date.now();
    options = options || {};

    var token = jwt.sign({
        user: user
    }, appSecret, {
        expiresIn: options.expires || tokenExpiresIn,
        issuer: tokenIssuer
    });
    return token;
};

exports.verifyToken = function(token, callback) {
    jwt.verify(token, appSecret, function(err, decoded) {
        if (err) {
            switch (err.message) {
                case 'jwt must be provided':
                    return callback("TOKEN_NOT_PROVIDED");
                case 'jwt expired':
                    return callback("TOKEN_EXPIRED");
                case 'invalid token':
                    return callback("INVALID_TOKEN");
                case 'invalid signature':
                    return callback("INVALID_SIGNATURE");
                default:
                    return callback("UNKNOWN_AUTH_ERROR");
            }
        }
        callback(null, decoded);
    });
};

exports.validateToken = function(token, callback) {
    exports.verifyToken(token, function(err, decoded) {
        if (err) {
            return callback(err);
        }
        callback(null, decoded.user);
    });
};