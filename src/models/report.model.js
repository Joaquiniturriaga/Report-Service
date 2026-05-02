const db = require('../config/db');

const create = async (report) => {
    const result = await db.query(
        `INSERT INTO reports (title, description, lat, lng, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [report.title, report.description, report.lat, report.lng, 'ACTIVE']
    );
    return result.rows[0];
};

const findAll = async () => {
    const result = await db.query('SELECT * FROM reports');
    return result.rows;
};

module.exports = { create, findAll };