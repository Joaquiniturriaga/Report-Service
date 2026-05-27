require('dotenv').config();

const express = require('express');

const reportRoutes = require('./src/routes/report.routes');

const { connectRabbit } = require('./src/config/rabbit');

const { initDB } = require('./src/config/db.init');

const {validateInternalSecret} = require('./src/middleware/internalSecret.middleware');

const {validateReport} =  require('./src/middleware/validateReport.middleware');


const app = express();

app.set('trust proxy',1 )
app.use(helmet());
app.use(express.json());


//Rate-limit por usuario maximo 5 request en 2 minutos

//usamos x user id como clave esto viene del gate despues de validar el jwt

//todos compartiran el mismo limite por ip aunque sean personas distinas

//el handler personalizado logea el intento por auditoria

const reportLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,   // ventana: 2 minutos
    max: 5,                     // máximo 5 requests por ventana por usuario
    keyGenerator: (req) => {
        // Si no viene x-user-id (acceso directo sin Gateway), limitar por IP
        return req.headers['x-user-id'] || req.ip;
    },
    handler: (req, res) => {
        const userId = req.headers['x-user-id'] || req.ip;
        console.warn(`[RATE LIMIT] user/ip bloqueado: ${userId} | ${new Date().toISOString()}`);
        res.status(429).json({
            error: 'Demasiados reportes. Máximo 5 en 2 minutos.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    },
    standardHeaders: true,   
    legacyHeaders: false,
});
 
// ── Internal secret — solo requests del Gateway ────────────────────────────
// Se aplica a todas las rutas EXCEPTO /internal/* que ya tiene su propio guard
const { validateInternalSecret } = require('./src/middlewares/internalSecret.middleware');
 
app.use('/api/reports', validateInternalSecret, reportLimiter, reportRoutes);
 
app.get('/', (req, res) => {
    res.json({ status: 'Report service running', version: '1.0.0' });
});
 
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: 'Internal server error' });
});
 



app.use('/api/reports', reportRoutes);

app.get('/', (req,res)=>{
    res.send('Report service running my bold ╰(*°▽°*)╯');
});


app.use((err, req , res, next)=>{
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
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

