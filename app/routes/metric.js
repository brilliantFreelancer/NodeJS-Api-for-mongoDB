const express = require('express');
let router = express.Router();

const metricController = require('../controller/metric.controller')
const checkAuth = require('../middleware/check-auth')

router.post('/GetMetricConfiguration', checkAuth.verifyToken, metricController.GetMetricConfiguration );

module.exports = router;
