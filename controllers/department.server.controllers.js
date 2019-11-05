'use strict';

const config = require('config');
const moment = require('moment');
const Sequelize = require('sequelize');
const request = require('request');
const randtoken = require('rand-token');
const db = require('../db/db');
const _ = require('underscore');
const Department = db.import('../models/department');
const UserRole = db.import('../models/user_role');
const Current_Date = new Date();
const fs = require('fs');
const DepartmentUtill = require('../utill/department')



exports.createDepartment = async function(req, res, next) {
    // Log entry.
    console.log('Department Controller: entering createDepartment ');
    const v = new lib.Validator('name:string');
    if (!v.run(req.body)) {
        return res.status(400).send(v.errors);
    }

    const department_name = req.body.name;
    const departmentExists = await DepartmentUtill.processNewDeprt(department_name);

    if (!departmentExists) {
        try {
            const deprtResult = await DepartmentUtill.processCreateDeprt(department_name);
            return res.status(200).send({
                message:'success',
                code: 200,
                data:deprtResult
            });

        } catch (err) {
            return next(err);
        }
    } else {
        return res.status(400).send({
            error: 'Department already exists',
            code: 400,
            status: 'fail'
        });
    }
}; /*End of createDepartment*/


exports.getAllDepartments = async(req, res, next) => {
    console.log('Department Controller: entering getAllDepartments ');
    try {
        const allDepartments = await DepartmentUtill.processGetAllDepartments();
        return res.send({
            code: 200,
            status: 'success',
            data: allDepartments,
        })
    } catch (err) {
        console.log(err);
        return res.send(err)
    }
}