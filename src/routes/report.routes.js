const express = require('express');
const { createReport, getReports, updateReportStatus } = require('../controllers/report.controller');
const { validateToken } = require('../middleware/validateToken.middleware');
const { authorizeRole } = require('../middleware/roles.middleware');

const router = express.Router();

router.post('/',           validateToken,                         createReport);
router.get('/',            validateToken,                         getReports);
router.put('/:id/status',  validateToken, authorizeRole('admin'), updateReportStatus);
 
module.exports = router;