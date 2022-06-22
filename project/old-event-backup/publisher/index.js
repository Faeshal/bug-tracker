require("pretty-error").start();
const log = require("log4js").getLogger("publisher");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

async function publisher(dataObj) {
  try {
    const { queueName } = dataObj;
    const msgBuffer = Buffer.from(JSON.stringify(dataObj));

    // * Prepare Rabbit Connection & Create Channel
    const connection = await rabbitConn();
    const channel = await connection.createChannel();

    // * Push to Queue
    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, msgBuffer);
    log.info("pushed to rabbitMQ 🐰...");

    // * Close the connection
    await channel.close();
    await connection.close();
  } catch (ex) {
    log.error(ex);
    return;
  }
}

module.exports = publisher;
