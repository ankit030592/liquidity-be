var express = require('express');
var router = express.Router();
var authModel = require('../controllers/auth.server.controllers');
var middlewares = require('../middlewares');

router.post('/',  authModel.processSignin);
router.post('/admin',  authModel.adminSignin);
router.get('/', authModel.processLogout);
router.get('/isLoggedIn', authModel.isLoggedIn);
router.get('/isAdminLoggedIn', authModel.isAdminLoggedIn);

module.exports = router;