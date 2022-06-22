require("pretty-error").start();
const log = require("log4js").getLogger("publisher");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

async function publisher(dataObj) {
  try {
    const { queueName } = dataObj;
    const msgBuffer = Buffer.from(JSON.stringify(dataObj));

    // * 1. Build Connection
    const connection = await rabbitConn();

    // * 2. Create Channle
    const channel = await connection.createChannel();

    // * 3. Assert Queue
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // * 4. Send Queue
    await channel.sendToQueue(queueName, msgBuffer, {
      persistent: true,
    });
    log.info("pushed to rabbitMQ 🐰...");

    // * 5 Close the connection
    // await channel.close();
    // await connection.close();
  } catch (ex) {
    log.error(ex);
    return;
  }
}

module.exports = publisher;
