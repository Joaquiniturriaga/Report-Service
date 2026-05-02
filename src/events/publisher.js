const { getChannel } = require('../config/rabbit');

const publishReport = async (report) => {
    const channel = getChannel();
    channel.sendToQueue(
        'reports_queue',
        Buffer.from(JSON.stringify(report))
    );
    console.log('Report sent to queue');
};

module.exports = { publishReport };