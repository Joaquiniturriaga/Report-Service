const express = require('express');
const { createReport, getReports, updateReportStatus } = require('../controllers/report.controller');
const { validateToken }          = require('../middleware/validateToken.middleware');
const { validateInternalSecret } = require('../middleware/internalSecret.middleware');
const { validateReport }         = require('../middleware/validateReport.middleware');
const reportLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.headers['x-user-id'] || ipKeyGenerator(req),
    handler: (req, res) => {
        console.warn(`[RateLimit] Bloqueado: ${req.headers['x-user-id'] || req.ip}`);
        res.status(429).json({ error: 'Demasiados reportes. Máximo 5 en 2 minutos.' });
    }
});
const router = express.Router();

router.put('/internal/:id/status', validateInternalSecret, updateReportStatus)
router.post('/',          validateToken, validateReport, createReport)
router.get('/',           validateToken, getReports)
router.put('/:id/status', validateToken, updateReportStatus)

module.exports = router;