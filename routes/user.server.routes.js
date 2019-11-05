var express = require('express');
var router = express.Router();
var User = require('../controllers/user.server.controllers');
var middlewares = require('../middlewares');

/*Create New user*/
router.post('/', User.createUser);

/*Update User Details*/
router.put('/:user_id', /*middlewares.user_admin_auth,*/ User.updateUser);

/*Get single user*/
router.get('/:user_id', User.getUser);

// /*Get all Users.*/
router.get('/', /*middlewares.admin_auth,*/ User.getAllUsers);

/*Delete user */
router.delete('/:user_id', /*middlewares.user_admin_auth,*/ User.deleteUser);

module.exports = router;