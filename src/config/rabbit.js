const amqp = require('amqplib');

let channel;

const connectRabbit = async () => {
    const conn = await amqp.connect(process.env.RABBIT_URL);
    channel = await conn.createChannel();
    await channel.assertQueue('reports_queue');
    console.log('RabbitMQ connected');
};

const getChannel = () => channel;

module.exports = { connectRabbit, getChannel };