require("pretty-error").start();
const amqp = require("amqplib/callback_api");
const rabbitConn = require("../../util/rabbitConn");
const log = require("log4js").getLogger("publisher");
log.level = "info";

async function pub(dataObj) {
  const { queueName } = dataObj;
  amqp.connect("amqp://localhost:5672", function (err, conn) {
    conn.createChannel((err, ch) => {
      ch.assertExchange(queueName, "fanout", { durable: false });
      ch.publish(queueName, "", Buffer.from(JSON.stringify(dataObj)));
      log.info("send 📩:", dataObj);
    });

    setTimeout(() => {
      conn.close();
    }, 500);
  });
}

module.exports = pub;
