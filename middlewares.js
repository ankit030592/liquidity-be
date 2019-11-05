var db = require('./db/db');
var User = db.import('./models/user');

var fail_obj = {
    status: 401,
    'error': 'you are not authenticated to perform this action'
};


exports.admin_auth = function(req, res, next) {
    if (!req.session.user) return res.status(401).send(messages.error.authFail);

    if (req.session.user.user_type === 'ADMIN') {
        return next();
    }
    return res.status(401).send(messages.error.authFail);
};

exports.user_auth = function(req, res, next) {
    if (!req.session.user) return res.status(401).send(messages.error.authFail);
    if (req.session.user.user_type === 'USER') {
        return next();
    }
    return res.status(401).send(messages.error.authFail);
};

exports.user_admin_auth = function(req, res, next) {
    if (!req.session.user) return res.status(401).send(messages.error.authFail);
    if ('ADMIN,USER'.indexOf(req.session.user.user_type) !== -1) {
        return next();
    }
    if (req.session.user) {
        return next();
    }
    return res.status(401).send(messages.error.authFail);
};