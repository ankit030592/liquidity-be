var express = require('express');
var router = express.Router();
var Department = require('../controllers/department.server.controllers');
var middlewares = require('../middlewares');

/*Create New department*/
router.post('/', Department.createDepartment);

// /*Get all Department */
router.get('/', Department.getAllDepartments);

module.exports = router;