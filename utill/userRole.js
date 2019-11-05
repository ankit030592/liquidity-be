'use strict';

const config = require('config');
const moment = require('moment');
const db = require('../db/db');
const UserRole = db.import('../models/user_role');




const processNewUserRole = (userRoleName) => {

    return new Promise((resolve, reject) => {
        UserRole.findOne({
            where: {
                user_role: (userRoleName).toUpperCase()
            }
        }).then(function(userRoleRecord) {
            console.log(userRoleRecord);
            if (!userRoleRecord) {
                resolve(false)
            } else {
                resolve(true)
            }
        }).catch(function(err) {
            reject(err)
        });
    });
};

const processCreateUserRole = (userRoleName) => {

    return new Promise((resolve, reject) => {
        let token = global.lib.getToken();
        UserRole.create({
            user_role: userRoleName.toUpperCase()
        }).then(function(userRoleData) {
            resolve(userRoleData.dataValues)
        }).catch(function(err) {
            reject(err)
        });
    });

}

module.exports = {
    processNewUserRole: processNewUserRole,
    processCreateUserRole: processCreateUserRole
};