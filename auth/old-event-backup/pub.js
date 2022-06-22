require("pretty-error").start();
const amqp = require("amqplib/callback_api");
const log = require("log4js").getLogger("pub");
log.level = "info";

amqp.connect("amqp://localhost:5672", function (err, conn) {
  conn.createChannel((err, ch) => {
    var msg = { username: "fahad", email: "fahad@mail.com" };

    ch.assertExchange("newUser", "fanout", { durable: false });
    ch.publish("newUser", "", Buffer.from(JSON.stringify(msg)));

    log.info(" [x] Sent %s", msg);
  });

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
});
