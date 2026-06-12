// app.js
const express = require('express');
const helmet  = require('helmet');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const reportRoutes               = require('./src/routes/report.routes');
const { validateInternalSecret } = require('./src/middleware/internalSecret.middleware');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());

const reportLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.headers['x-user-id'] || ipKeyGenerator(req),
    handler: (req, res) => {
        console.warn(`[RateLimit] Bloqueado: ${req.headers['x-user-id'] || req.ip}`);
        res.status(429).json({ error: 'Demasiados reportes. Máximo 5 en 2 minutos.' });
    }
});


app.use('/api/reports', validateInternalSecret, reportRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'Report service running', version: '1.0.0' });
});

app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;