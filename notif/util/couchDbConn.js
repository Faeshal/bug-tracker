require("pretty-error").start();
const log = require("log4js").getLogger("util-rabbitConn");
log.level = "info";

async function db() {
  try {
    const db = require("nano")("http://localhost:5984/bugtracker-notif");
    return db;
  } catch (err) {
    log.error(err);
  }
}

module.exports = db;
