require("pretty-error").start();
const log = require("log4js").getLogger("sub-redis");
log.level = "info";
const Redis = require("ioredis");
const redis = new Redis();

const processMessage = async (message) => {
  const key = message[0];
  const arr = message[1];
  let obj = {
    key,
    data: JSON.parse(arr[1]),
  };
  log.info("incoming data 📩:", obj);

  // * Set cache Last Stream Id
  const setId = await redis.set("id_userstream_commentservice", key);
  log.info("set cacheId 💾:", setId);
};

async function redisSub() {
  let lastId;

  // * check lastId cache
  const cacheId = await redis.get("id_userstream_commentservice");
  if (cacheId == null) {
    lastId = "$";
  } else {
    lastId = cacheId;
  }

  log.info("lastId:", lastId);
  const results = await redis.xread(
    "block",
    0,
    "STREAMS",
    "userStream",
    lastId
  );

  const [key, messages] = results[0]; // key = "userStream" nama streamnya

  messages.forEach(processMessage);

  // Pass the last id of the results to the next round.
  await redisSub(messages[messages.length - 1][0]);
}

module.exports = redisSub;
