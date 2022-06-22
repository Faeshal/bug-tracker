require("pretty-error").start();
const log = require("log4js").getLogger("publisher");
log.level = "info";
const Redis = require("ioredis");
const redis = new Redis();

async function redisPub(dataObj) {
  try {
    const info = await redis.xinfo("GROUPS", "userStream");
    log.info(info);
  } catch (err) {
    log.error("group not exist, creating...", err);
    // * 1 create group if not exist
    const create = await redis.xgroup(
      "CREATE",
      "userStream",
      "userGroup",
      "$",
      "MKSTREAM"
    );
    log.info("create group:", create);
  }

  // * 2 send data to stream
  await redis.xadd(
    "userStream", // stream name
    "*", // means redis give incremental data id
    "data", // key
    JSON.stringify(dataObj) // value
  );
  log.info("sent ✈️", dataObj);
}

module.exports = redisPub;
