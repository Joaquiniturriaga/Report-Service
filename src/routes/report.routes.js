const express = require('express');
const { createReport, getReports, updateReportStatus } = require('../controllers/report.controller');
const { validateToken } = require('../middleware/validateToken.middleware');

const router = express.Router();

router.post('/',           validateToken,                         createReport);
router.get('/',            validateToken,                         getReports);
router.put('/:id/status',       validateToken, updateReportStatus);  
router.put('/internal/:id/status', updateReportStatus);             

module.exports = router;