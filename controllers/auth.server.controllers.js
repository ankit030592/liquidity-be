'use strict';

const db = require('../db/db');
const User = db.import('../models/user');
const Department = db.import('../models/department');
const UserRole = db.import('../models/user_role');
const UserUtill = require('../utill/user');

User.belongsTo(UserRole, {
    foreignKey: 'user_role_id'
});


User.belongsTo(Department, {
    foreignKey: 'department_id'
});


exports.processSignin = async(req, res, next) => {
    const v = new lib.Validator('email:string,password:string');
    if (!v.run(req.body)) {
        return res.status(400).send(v.errors);
    }
    const token = lib.getToken();
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userData = await loginUtil(email, password);
        console.log(userData);
        if (!userData) return res.status(401).send(messages.error.failedLogin);
        const user_type = userData.user_role.dataValues.user_role;
        if (user_type !== 'USER') return res.status(401).send(messages.error.failedLogin);
        let user = await UserUtill.processgetUser(userData.id);
        if (!user) return res.send(messages.error.userNotFound);
        const updateUSerStatus = await updateToken(token, email);
        console.log(user);
        if (updateUSerStatus) {
            user.token = token.token;
            req.session.user = user;
            return res.send({
                code: 200,
                status: 'User Successfully Logged in',
                data: user
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(401).send(messages.error.failedLogin);
    }
}


exports.adminSignin = async(req, res, next) => {
    const v = new lib.Validator('email:string,password:string');
    if (!v.run(req.body)) {
        return res.status(400).send(v.errors);
    }
    const token = lib.getToken();
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userData = await loginUtil(email, password);
        console.log(userData);
        if (!userData) return res.status(401).send(messages.error.failedLogin);
        console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
        const user_type = userData.user_role.dataValues.user_role;
        console.log(user_type);
        if (user_type !== 'ADMIN') return res.status(401).send(messages.error.failedLogin);
        console.log('condition passed');
        let user = await UserUtill.processgetUser(userData.id);
        console.log('==============================')
        console.log(user)
        if (!user) return res.send(messages.error.userNotFound);
        const updateUSerStatus = await updateToken(token, email);
        console.log(user);
        if (updateUSerStatus) {
            user.token = token.token;
            req.session.user = user;
            return res.send({
                code: 200,
                status: 'User Successfully Logged in',
                data: user
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(401).send(messages.error.failedLogin);
    }
}



exports.adminLogin = async(req, res, next) => {
    var fail_res = {
        status: 401,
        message: 'Please enter email and password'
    };
    if (!(req.body.email && req.body.password)) {
        return res.status(401).send(fail_res);
    }
    if (req.body.password.length < 6) {
        return res.status(402).send({
            error: "Password should be minimum 6 characters"
        });
    }
    db.users.findOne({
        'type': 'admin'
    }, function(err, admin) {
        if (err) return next(err);
        if (!admin) {
            return res.status(401).send(fail_res);
        }
        if (lib.getSaltedPassword(req.body.password) != admin.password) {
            return res.status(401).send({
                error: "The email and password you entered don't match"
            });
        } else if (req.body.email != admin.email) {
            return res.status(401).send({
                error: "The email and password you entered don't match"
            });
        }
        req.session.user = admin;
        console.log("user", req.session.user);
        return res.send({
            data: 'Logged in',
            admin: admin
        });
    });
}


/*user logout*/
exports.processLogout = (req, res, next) => {
    console.log('Auth Controller: entering logout');
    req.session.user = false;
    delete req.session.cart;
    console.log(req.session);
    res.status(200).send({
        status: 'logged out'
    });
};


exports.isLoggedIn = async(req, res, next) => {
    let is_logged_in = 'no';
    console.log(req.session);
    if (!req.session.user) {
        return res.status(401).send(messages.error.userNotLoggedin);
    } else {
        console.log(req.session.user.user_type);
        if (req.session.user.user_type !== 'USER') {
            return res.status(401).send(messages.error.userNotLoggedin);
        } else {
            is_logged_in = 'yes';
            const user = req.session.user;
            try {
                const userDetail = await UserUtill.processgetUser(user.id);
                if (!user) return res.status(404).send(messages.error.userNotFound);
                return res.status(200).send({
                    code: 200,
                    status: is_logged_in,
                    data: user,
                });
            } catch (err) {
                console.log(err);
                return res.status(500).send(messages.error.failedUserSession);
            }
        }
    }
};


exports.isAdminLoggedIn = async(req, res, next) => {
    var is_logged_in = 'no';
    if (!req.session.user) {
        return res.status(401).send(messages.error.userNotLoggedin);
    } else {
        if (req.session.user.user_type !== 'ADMIN') {
            return res.status(401).send(messages.error.userNotLoggedin);
        } else {
            is_logged_in = 'yes';
            const user = req.session.user;
            try {
                const userDetail = await UserUtill.processgetUser(user.id);
                if (!user) return res.status(404).send(messages.error.userNotFound);
                return res.status(200).send({
                    code: 200,
                    status: is_logged_in,
                    data: user,
                });
            } catch (err) {
                return res.status(500).send(messages.error.failedUserSession);
            }
        }
    }
};


const loginUtil = (email, password) => {
    return new Promise((resolve, reject) => {

        User.findOne({
            where: {
                email: email,
                password: lib.getSaltedPassword(password)
            },
            include: [{
                model: Department,
                attributes: ['department']
            }, {
                model: UserRole,
                attributes: ['user_role']
            }]
        }).then(userData => {
            resolve(userData.dataValues);
        }).catch(err => {
            reject(err);
        });
    });
}

const updateToken = (token, email) => {

    return new Promise((resolve, reject) => {
        User.update({
            token: token.token,
            token_issued_on: token.issued_on,
            token_expires_on: token.expires_on,
        }, {
            where: {
                email: email
            }
        }).then(updateUser => {
            console.log('updated');
            console.log(updateUser);
            if (updateUser[0] == 1) resolve('new token created');
            else reject('Failed to create new token');
        }).catch(err => {
            reject(err);
        });
    });
}