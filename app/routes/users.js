const express = require('express');
let router = express.Router();

const userController = require('../controller/users.controller')
const checkAuth = require('../middleware/check-auth')

/*
* login management API
*
* */

router.post('/validatelogin', userController.validatelogin);
router.get('/logout', checkAuth.verifyToken, userController.logout);

module.exports = router;
