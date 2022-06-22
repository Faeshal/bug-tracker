require("pretty-error").start();
// const amqp = require("amqplib/callback_api");
const amqplib = require("amqplib");
const User = require("../../models").user;
const _ = require("underscore");
const log = require("log4js").getLogger("consumer");
log.level = "info";
const rabbitConn = require("../../util/rabbitConn");

var amqp_url = "amqp://localhost:5672";

async function do_consume() {
  var conn = await amqplib.connect(amqp_url, "heartbeat=60");
  var ch = await conn.createChannel();
  var q = "newUser";
  await conn.createChannel();

  await ch.assertExchange("user", "fanout", {
    durable: true,
  });

  await ch.assertQueue(q, { durable: true });
  await ch.bindQueue(q, "user", "");
  const result = await ch.consume(q, function (msg) {
    console.log(msg.content.toString());
    ch.ack(msg);
  });

  log.info("result", result);
  // setTimeout(function () {
  //   ch.close();
  //   conn.close();
  // }, 500);
}

module.exports = do_consume;
