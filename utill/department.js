'use strict';

const config = require('config');
const moment = require('moment');
const db = require('../db/db');
const Department = db.import('../models/department');




const processNewDeprt = (department) => {

    return new Promise((resolve, reject) => {
        Department.findOne({
            where: {
                department: (department).toUpperCase()
            }
        }).then(function(departmentRecord) {
            console.log(departmentRecord);
            if (!departmentRecord) {
                resolve(false)
            } else {
                resolve(true)
            }
        }).catch(function(err) {
            reject(err)
        });
    });
};

const processCreateDeprt = (deparment_name) => {

    return new Promise((resolve, reject) => {
        let token = global.lib.getToken();
        Department.create({
            department: (deparment_name).toUpperCase()
        }).then(function(departmentData) {
            resolve(departmentData.dataValues)
        }).catch(function(err) {
            reject(err)
        });
    });

};

const processGetAllDepartments = () => {
    return new Promise((resolve, reject) => {
        Department.findAll().then(departments => {
            /*const deptList = departments.map(department => {
                const departmentObj = {
                    "id": department.id,
                    "department": department.department
                }
                return departmentObj;
            });*/
            resolve(departments);
        }).catch(err => {
            reject(messages.error.userNotFound);
        });
    });
};


module.exports = {
    processNewDeprt: processNewDeprt,
    processCreateDeprt: processCreateDeprt,
    processGetAllDepartments: processGetAllDepartments 
};