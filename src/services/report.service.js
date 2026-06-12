const reportModel = require('../models/report.model');
const { publishReport } = require('../events/publisher');

const createReport = async (data, user) => {
    const newReport = {
        title:       data.title,
        description: data.description,
        lat:         data.lat,
        lng:         data.lng,
        tipo:        data.tipo || 'INCENDIO'
    };

    const savedReport = await reportModel.create(newReport);
    await publishReport(savedReport);
    return savedReport;
};

const getReports = async () => {
    return await reportModel.findAll();
};

const updateReportStatus = async (id, status) => {
    return await reportModel.updateStatus(id, status);
};


module.exports = { createReport, getReports , updateReportStatus};