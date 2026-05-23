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

const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
 
        const validStatuses = ['ACTIVE', 'CONTROLLED', 'REVIEWED', 'DISMISSED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
        }
 
        const updated = await reportService.updateReportStatus(parseInt(id), status);
        if (!updated) return res.status(404).json({ error: 'Report not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { createReport, getReports, updateReportStatus };