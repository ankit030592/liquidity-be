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
const UserUtill = require('../utill/user')

exports.createUser = async(req, res, next) => {
    console.log(req.body);
    console.log('User Controller: entering createUser ');
    let v = new lib.Validator('f_name:string,l_name:string,email:email,password:string,_password:string,phone:number,department_id:number');
    if (!v.run(req.body)) {
        console.log(v.errors);
        return res.status(400).send(v.errors);
    }

    if (req.body.password !== req.body._password) {
        return res.status(400).send({
            error: "Re-entered password does not matches"
        });
    }
    // const userEmail = req.body.email;

    const f_name = req.body.f_name
    const m_name = req.body.m_name
    const l_name = req.body.l_name
    const email = req.body.email
    const password = req.body.password;
    const phone = req.body.phone;
    const department_id = req.body.department_id;
    const user_role_id = USER_ROLE_ID;

    const token = lib.getToken();

    try {
        const emailExists = await UserUtill.processNewEmail(email)
        if (!emailExists) {
            try {
                const userResult = await UserUtill.processCreateUser(f_name, m_name, l_name, email, password, phone, department_id, user_role_id)
                console.log(userResult);
                return res.status(200).send({
                    code: 200,
                    status: 'User Successfully created',
                    data: userResult
                });

            } catch (err) {
                console.log(err);
                return next(err);
            }
        } else {
            console.log(messages.error.emailExists);
            return res.status(400).send(messages.error.emailExists);
        }
        console.log(emailExists)
        return res.status(400).send(emailExists)
    } catch (err) {
        return next(err);
    }
}

exports.getAllUsers = async(req, res, next) => {
    console.log('User Controller: entering getAllUsers ');
    try {
        const allUsers = await UserUtill.processGetAllUsers(USER_ROLE_ID)
        return res.send({
            code: 200,
            status: 'success',
            data: allUsers,
        })
    } catch (err) {
        console.log(err);
        return res.send(err)
    }
}

exports.getUser = async(req, res, next) => {
    console.log('User Controller: entering getUser ');
/*    const user_type = req.session.user.user_type;
    
    let user_id = req.session.user.id;

    if (req.session.user.user_type === 'ADMIN') {
        user_id = req.param.user_id;
    }*/
    let user_id = req.params.user_id;

    try {
        const user = await UserUtill.processgetUser(user_id);
        if (!user) return res.send(messages.error.userNotFound);
        return res.status(200).send({
            code: 200,
            status: 'success',
            data: user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.updateUser = async(req, res, next) => {
    console.log('User Controller: entering updateUser ');
    const user_input = req.body;

/*    const user_type = req.session.user.user_type;
    
    let user_id = req.session.user.id;

    if (req.session.user.user_type === 'ADMIN') {
        user_id = req.param.user_id;
    }*/
    let user_id = req.params.user_id;
    console.log('user server controller ',user_input)
    try {
        const user = await UserUtill.processUdateUser(user_id, user_input);
        return res.status(200).send({
            code: 200,
            status: 'success',
            data: user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }


};

exports.deleteUser = async(req, res, next) => {

    console.log('User Controller: entering deleteUser ');
    const user_input = req.body;

/*    const user_type = req.session.user.user_type;
    
    let user_id = req.session.user.id;

    if (req.session.user.user_type === 'ADMIN') {
        user_id = req.param.user_id;
    }*/
    let user_id = req.params.user_id;

    try {
        const result = await UserUtill.processDeleteUser(user_id);
        return res.status(200).send(result);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}