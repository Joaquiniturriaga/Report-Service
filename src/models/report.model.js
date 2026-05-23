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

const updateStatus = async (id, status) => {
    const result = await db.query(
        `UPDATE reports SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );
    return result.rows[0] || null;
};

module.exports = { create, findAll, updateStatus };