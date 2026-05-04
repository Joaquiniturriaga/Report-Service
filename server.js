require('dotenv').config();

const express = require('express');

const reportRoutes = require('./src/routes/report.routes');

const { connectRabbit } = require('./src/config/rabbit');

const { initDB } = require('./src/config/db.init');


const app = express();
app.use(express.json);

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
    }

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Report service running on port ${PORT}`);
    });
};

startServer();

