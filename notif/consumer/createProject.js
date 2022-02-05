require("pretty-error").start();
const log = require("log4js").getLogger("consumer-createProject");
log.level = "info";
const rabbitConn = require("../util/rabbitConn");
const nano = require("nano")("http://admin:root@localhost:5984");
const db = nano.use("bugtracker-notif");

async function consumeNewProject() {
  try {
    // * Preare Connection & Channel
    const connection = await rabbitConn();
    const channel = await connection.createChannel();

    // * get queue name & consume
    await channel.assertQueue("createProject");
    channel.consume("createProject", async (message) => {
      const input = JSON.parse(message.content.toString());
      console.log("data from project service:", input);

      const result = await db.insert(input);
      console.log(result);
      channel.ack(message);
    });

    log.info(`Waiting for messages...`);
  } catch (ex) {
    console.error(ex);
  }
}

module.exports = consumeNewProject;
