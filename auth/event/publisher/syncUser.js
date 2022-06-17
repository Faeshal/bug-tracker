require("pretty-error").start();
const log = require("log4js").getLogger("publisher-syncUser");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

async function syncUserPub(dataObj) {
  try {
    log.info("incoming data obj 📨:", dataObj);
    const msgBuffer = Buffer.from(JSON.stringify(dataObj));

    // * Prepare Rabbit Connection & Create Channel
    const connection = await rabbitConn();
    const channel = await connection.createChannel();

    // * Push to Queue
    await channel.assertQueue("syncUser");
    await channel.sendToQueue("syncUser", msgBuffer);
    log.info("pushed to rabbit 🐰 ....");

    // * Close the connection
    await channel.close();
    await connection.close();
  } catch (ex) {
    log.error(ex);
    return;
  }
}

module.exports = syncUserPub;
