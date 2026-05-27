const express = require('express');
const { createReport, getReports, updateReportStatus } = require('../controllers/report.controller');
const { validateToken } = require('../middleware/validateToken.middleware');
const { validateInternalSecret } = require('../middleware/internalSecret.middleware');
const { validateReportBody } = require('../middleware/validateReport.middleware');

const router = express.Router();
//Rutas normales pasan por validateToken( y el rate limit aplicado del server)
router.put('/internal/:id/status', validateInternalSecret, updateReportStatus);

router.post('/',validateToken,  validateReportBody,createReport);
router.get('/', validateToken ,getReports);
router.put('/:id/status', validateToken, updateReportStatus);  


router.put('/:id/status', validateToken,updateReportStatus);

module.exports = router;