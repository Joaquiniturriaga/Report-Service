require('dotenv').config();

const express    = require('express');
const helmet     = require('helmet');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit')

const reportRoutes               = require('./src/routes/report.routes');
const { connectRabbit }          = require('./src/config/rabbit');
const { initDB }                 = require('./src/config/db.init');
const { validateInternalSecret } = require('./src/middleware/internalSecret.middleware');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());

const reportLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.headers['x-user-id'] || ipKeyGenerator(req),  // ← fix
  handler: (req, res) => {
    console.warn(`[RateLimit] Bloqueado: ${req.headers['x-user-id'] || req.ip}`)
    res.status(429).json({ error: 'Demasiados reportes. Máximo 5 en 2 minutos.' })
  }
})

app.use('/api/reports', validateInternalSecret, reportRoutes)

app.get('/', (req, res) => {
    res.json({ status: 'Report service running', version: '1.0.0' });
});

app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
    try {
        await initDB();
        await connectRabbit();
    } catch (error) {
        console.error('Error al iniciar:', error.message);
        process.exit(1);
    }

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Report service running on port ${PORT}`);
    });
};

startServer();