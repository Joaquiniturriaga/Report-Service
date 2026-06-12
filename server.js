// server.js
require('dotenv').config();

const app                = require('./app');
const { connectRabbit }  = require('./src/config/rabbit');
const { initDB }         = require('./src/config/db.init');

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