const express = require('express');
let router = express.Router();
const checkAuth = require('../middleware/check-auth')
/* GET home page. */
router.get('/', checkAuth.verifyToken, function(req, res, next) {
  res.json({status:true,msg:'you is login.'});
});
router.get('/login', function(req, res, next) {
  res.json({status:true,msg:'you need to login.'})
});

module.exports = router;
