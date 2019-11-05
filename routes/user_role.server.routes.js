var express = require('express');
var router = express.Router();
var UserRole = require('../controllers/user_role.server.controllers');
var middlewares = require('../middlewares');

/*Create New user role*/
router.post('/', UserRole.createUserRole);

module.exports = router;