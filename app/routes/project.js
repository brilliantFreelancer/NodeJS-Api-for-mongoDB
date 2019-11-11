const express = require('express');
let router = express.Router();

const projectController = require('../controller/project.controller')
const checkAuth = require('../middleware/check-auth')


router.post('/updateProjectPerformance', checkAuth.verifyToken, projectController.updateProjectPerformance );

router.post('/getProjectMetricPerformance', checkAuth.verifyToken, projectController.getProjectMetricPerformance );

router.post('/getProjectByAccount', checkAuth.verifyToken, projectController.getProjectByAccount );



module.exports = router;
