const pool = require('./db');

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS reports (
            id          SERIAL PRIMARY KEY,
            title       VARCHAR(255) NOT NULL,
            description TEXT,
            lat         DECIMAL(10,7),
            lng         DECIMAL(10,7),
            tipo        VARCHAR(50) DEFAULT 'INCENDIO',
            status      VARCHAR(50) DEFAULT 'ACTIVE',
            created_at  TIMESTAMP DEFAULT NOW()
        )
    `);
    
    await pool.query(`
        ALTER TABLE reports 
        ADD COLUMN IF NOT EXISTS tipo VARCHAR(50) DEFAULT 'INCENDIO'
    `);

    console.log('Database initialized');
};

module.exports = { initDB };