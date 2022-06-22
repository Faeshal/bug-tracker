require("pretty-error").start();
const User = require("../../models").user;
const Project = require("../../models").project;
const Card = require("../../models").card;
const _ = require("underscore");
const log = require("log4js").getLogger("consumer");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

async function eventConsumer() {
  try {
    // * 1. Build Connection
    const connection = await rabbitConn();

    // * 2. Create Channel
    const channel = await connection.createChannel();

    // * 3. Assert Queue Name
    await channel.assertQueue("newUser");

    // * 4. Consume Queue
    channel.consume("newUser", async (message) => {
      let dataObj = JSON.parse(message.content.toString());
      log.info("data from event 🗃️:", dataObj);

      // * fmtDataObj
      dataObj = _.omit(dataObj, "queueName");
      log.info("after omit:", dataObj);

      // * processor
      const user = await User.findOne({ where: { id: parseInt(dataObj.id) } });
      if (!user) {
        await User.create(dataObj);
      }
      // channel.ack(message);
    });

    log.info("eventConsumer UP 🔉");
  } catch (ex) {
    log.error(ex);
    return;
  }
}

module.exports = eventConsumer;
