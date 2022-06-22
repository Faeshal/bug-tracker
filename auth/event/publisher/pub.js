require("pretty-error").start();
const amqp = require("amqplib/callback_api");
const rabbitConn = require("../../util/rabbitConn");
const log = require("log4js").getLogger("publisher");
log.level = "info";

async function pub(dataObj) {
  const { queueName } = dataObj;
  log.warn("data entering publisher 👉:", dataObj);

  // * 1. build connection
  amqp.connect("amqp://localhost:5672", function (err, conn) {
    // * 2. create channel
    conn.createChannel((err, ch) => {
      const exchangeName = "user";

      // * 3. Assert
      ch.assertExchange(exchangeName, "fanout", {
        durable: true,
      });

      // * 4. Publish
      const result = ch.publish(
        exchangeName,
        queueName,
        Buffer.from(JSON.stringify(dataObj)),
        {
          persistent: true,
        }
      );
      log.info("send 📩:", result);
    });

    setTimeout(() => {
      conn.close();
    }, 500);
  });
}

module.exports = pub;
