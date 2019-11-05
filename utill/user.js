'use strict';

const config = require('config');
const moment = require('moment');
const db = require('../db/db');
const User = db.import('../models/user');
const Department = db.import('../models/department');
const UserRole = db.import('../models/user_role');


const Current_Date = new Date();

User.belongsTo(UserRole, {
    foreignKey: 'user_role_id'
});


User.belongsTo(Department, {
    foreignKey: 'department_id'
});

const processNewEmail = (email) => {

    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                email: (email).toLowerCase()
            }
        }).then(userRecord => {
            console.log(userRecord);
            if (!userRecord) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch(err => {
            reject(err);
        });
    });
};

const processCreateUser = (f_Name, m_Name, l_Name, email, password, phone, department_id, user_role_id) => {

    // department_id = 1


    return new Promise((resolve, reject) => {
        let token = global.lib.getToken();
        console.log(token);
        User.create({
            email: (email).toLowerCase(),
            password: lib.getSaltedPassword(password),
            f_name: f_Name,
            m_name: m_Name,
            l_name: l_Name,
            phone: phone,
            user_role_id: user_role_id,
            token: token.token,
            department_id: department_id,
            token_issued_on: token.issued_on,
            token_expires_on: token.expires_on,
        }).then(userData => {
            console.log(userData);
            return userData.id;
        }).then(async user_id => {
            try {
                const userDetail = await processgetUser(user_id);
                resolve(userDetail);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        }).catch(err => {
            console.log(err);
            reject(messages.error.createUserFail);
        });
    });

};

const processGetAllUsers = (user_role_id) => {
    return new Promise((resolve, reject) => {
        User.findAll({
            where: {
                user_role_id: user_role_id
            },
            attributes: ['id', 'f_name', 'm_name', 'l_name', 'email', 'phone'],
            include: [{
                model: Department,
                attributes: ['department']
            }, {
                model: UserRole,
                attributes: ['user_role']
            }]
        }).then(users => {
            const userList = users.map(user => {
                const userObj = {
                    "id": user.id,
                    "f_name": user.f_name,
                    "m_name": user.m_name,
                    "l_name": user.l_name,
                    "email": user.email,
                    "phone": user.phone,
                    "user_type": user.user_role.dataValues.user_role,
                    "department": user.department.dataValues.department
                }
                return userObj;
            });
            // console.log(userList);
            resolve(userList);
        }).catch(err => {
            reject(messages.error.userNotFound);
        });
    });
};

const processgetUser = (user_id) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                id: user_id
            },
            attributes: ['id', 'f_name', 'm_name', 'l_name', 'email', 'phone'],
            include: [{
                model: Department,
                attributes: ['department']
            }, {
                model: UserRole,
                attributes: ['user_role']
            }]
        }).then(user => {
            console.log(user);
            let department;
            if (user.department) {
                department = user.department.dataValues.department
            } else {
                department = null;
            }
            const userObj = {
                "id": user.id,
                "f_name": user.f_name,
                "m_name": user.m_name,
                "l_name": user.l_name,
                "email": user.email,
                "phone": user.phone,
                "user_type": user.user_role.dataValues.user_role,
                "department": department
            }
            console.log(userObj);
            resolve(userObj);
        }).catch(err => {
            console.log(err);
            reject(messages.error.userNotFound);
        });
    });
};

const processUdateUser = (user_id, user_input) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await processgetUser(user_id);
            if (!user) return reject(messages.error.userNotFound);
            const fields = ["f_name", "m_name", "l_name", "phone", "department_id"];
            let changes = 0;
            fields.map(field => {
                if (user_input[field]) {
                    user[field] = user_input[field];
                    changes++;
                }
            });

            user.updated = Current_Date;
            console.log('user is ??? ', user);

            User.update(user, {
                where: {
                    id: user_id
                }
            }).then(update_status => {
                return update_status;
            }).then(update_status => {
                console.log(update_status[0]);
                if (update_status[0] == 1) {
                    User.findById(user_id).then(user_details => {
                        return resolve(user_details);
                    });
                } else {
                    return reject(messages.error.updateUSerFail);
                }
            }).catch(err => {
                reject(messages.error.updateUSerFail);
            });
        } catch (err) {
            console.log(err);
            reject(messages.error.updateUSerFail);
        }
    });
};

const processDeleteUser = (user_id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await processgetUser(user_id);
            if (!user) return reject(messages.error.userNotFound);
            User.destroy({
                where: {
                    id: user_id
                }
            }).then(result => {
                console.log(result);
                return resolve(messages.success.deleteUser);
            }).catch(err => {
                console.log('could not delete user');
                console.log(err);
                return reject(messages.error.deleteUserFail);
            });
        } catch (err) {
            console.log(err);
            reject(messages.error.deleteUserFail);
        }
    });
}


module.exports = {
    processNewEmail: processNewEmail,
    processCreateUser: processCreateUser,
    processGetAllUsers: processGetAllUsers,
    processgetUser: processgetUser,
    processUdateUser: processUdateUser,
    processDeleteUser: processDeleteUser
};