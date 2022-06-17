require("pretty-error").start();
const User = require("../../models").user;
const log = require("log4js").getLogger("consumer-syncUser");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

async function syncUserSub() {
  try {
    // * Preare Connection & Channel
    const connection = await rabbitConn();
    const channel = await connection.createChannel();

    // * get queue name & consume
    await channel.assertQueue("syncUser");
    channel.consume("syncUser", async (message) => {
      const input = JSON.parse(message.content.toString());
      log.info("data from another service 🐰:", input);

      // * logic
      await User.create(input);
      channel.ack(message);
    });

    log.info("syncUserEvent UP 🔉");
  } catch (ex) {
    log.error(ex);
    return;
  }
}

syncUserSub();
module.exports = syncUserSub;
