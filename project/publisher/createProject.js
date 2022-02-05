require("pretty-error").start();
const log = require("log4js").getLogger("scrap-publisher");
log.level = "info";
const rabbitConn = require("../util/rabbitConn");

async function createProjectPub(dataObj) {
  try {
    const msgBuffer = Buffer.from(JSON.stringify(dataObj));

    // * Prepare Rabbit Connection & Create Channel
    const connection = await rabbitConn();
    const channel = await connection.createChannel();

    // * Push to Queue
    await channel.assertQueue("createProject");
    await channel.sendToQueue("createProject", msgBuffer);
    log.info("success push to rabbitmq....");

    // * Close the connection
    await channel.close();
    await connection.close();
  } catch (ex) {
    log.error(ex);
  }
}

module.exports = createProjectPub;
