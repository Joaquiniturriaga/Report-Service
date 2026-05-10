const db = require('../config/db');

const create = async (report) => {
    const result = await db.query(
        `INSERT INTO reports (title, description, lat, lng, tipo , status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [report.title, report.description, report.lat, report.lng, report.tipo || 'INCENDIO', 'ACTIVE']
    );
    return result.rows[0];
};

const findAll = async () => {
    const result = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
    return result.rows;
};

module.exports = { create, findAll };