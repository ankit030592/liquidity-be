'use strict';

const config = require('config');
const moment = require('moment');
const Sequelize = require('sequelize');
const request = require('request');
const randtoken = require('rand-token');
const db = require('../db/db');
const _ = require('underscore');
const User = db.import('../models/user');
const Department = db.import('../models/department');
const UserRole = db.import('../models/user_role');
const Current_Date = new Date();
const fs = require('fs');
const UserRoleUtill = require('../utill/userRole')


exports.createUserRole = async function(req, res, next) {
    // Log entry.
    console.log('User Controller: entering createUserRole ');
    console.log(req.body);
    let v = new lib.Validator('user_role:string');
    if (!v.run(req.body)) {
        return res.status(400).send(v.errors);
    }

    const userRoleName = req.body.user_role;
    const userRoleExists = await UserRoleUtill.processNewUserRole(userRoleName);

    if (!userRoleExists) {
        try {
            const userRoleResult = await UserRoleUtill.processCreateUserRole(userRoleName);
            return res.status(200).send(messages.success.createRole);

        } catch (err) {
            return next(err);
        }
    } else {
        return res.status(400).send(messages.error.roleExists);
    }
}; /*End of createUserRole*/