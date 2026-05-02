const express = require('express');
const { createReport, getReports } = require('../controllers/report.controller');
const { validateToken } = require('../middleware/validateToken.middleware');

const router = express.Router();

router.post('/', validateToken, createReport);
router.get('/', validateToken, getReports);

module.exports = router;