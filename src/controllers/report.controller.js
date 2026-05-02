const reportService = require('../services/report.service');

const createReport = async (req, res) => {
    try {
        const report = await reportService.createReport(req.body, req.user);
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReports = async (req, res) => {
    try {
        const reports = await reportService.getReports();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createReport, getReports };