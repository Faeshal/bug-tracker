require("pretty-error").start();
const amqp = require("amqplib/callback_api");
const User = require("../../models").user;
const _ = require("underscore");
const log = require("log4js").getLogger("consumer");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

async function do_consume() {
  var q = "newUser";
  let exchange = "user";

  // * 1. Build Connection
  const connection = await rabbitConn();

  // * 2. Create Channle
  const ch = await connection.createChannel();

  await ch.assertExchange(exchange, "fanout", {
    durable: true,
  });

  await ch.assertQueue(q, { durable: true });

  await ch.bindQueue(q, exchange, "");

  await ch.consume(q, function (msg) {
    log.info("data coming 🎉:");
    ch.ack(msg);
  });
  setTimeout(function () {
    ch.close();
    connection.close();
  }, 500);
}

module.exports = do_consume;
