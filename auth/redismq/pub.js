require("pretty-error").start();
const log = require("log4js").getLogger("publisher");
log.level = "info";
const Redis = require("ioredis");
const redis = new Redis();

async function redisPub(dataObj) {
  await redis.xadd(
    "userStream", // stream name
    "*", // means redis give incremental data id
    "data", // key
    JSON.stringify(dataObj) // value
  );
  log.info("sent ✈️", dataObj);
}

module.exports = redisPub;
