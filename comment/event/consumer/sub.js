require("pretty-error").start();
const amqp = require("amqplib/callback_api");
const User = require("../../models").user;
const _ = require("underscore");
const log = require("log4js").getLogger("consumer");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

async function do_consume() {
  amqp.connect("amqp://localhost:5672", (err, conn) => {
    conn.createChannel((err, ch) => {
      ch.assertExchange("newUser", "fanout", { durable: false });

      ch.assertQueue("", { exclusive: true }, (err, q) => {
        log.info(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );

        ch.bindQueue(q.queue, "newUser", "");

        ch.consume(
          q.queue,
          (msg) => {
            log.info(" [x] %s", msg.content.toString());
          },
          { noAck: false }
        );
      });
    });
  });
}

module.exports = do_consume;
