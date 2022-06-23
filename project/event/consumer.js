require("pretty-error").start();
const User = require("../models").user;
const _ = require("underscore");
const log = require("log4js").getLogger("sub-redis");
log.level = "info";
const Redis = require("ioredis");
const redis = new Redis();

// * Processor / Job
const newUserProcess = async (message) => {
  const key = message[0];
  const rawArr = message[1];
  const rawObj = JSON.parse(rawArr[1]);
  log.info("incoming data 📩:", rawObj);

  // * Set cache Last Stream Id
  const setId = await redis.set("id_newuser_projectservice", key);
  log.info("set cache userId 💾:", setId);

  // * business logic
  let userObj = _.omit(rawObj, "stream");
  const user = await User.findOne({ where: { id: userObj.id } });
  if (!user) {
    await User.create(userObj);
  }
};

// * Stream Consumer
async function eventConsumer() {
  // * newUser stream
  let newUserId;
  const cacheNewUserId = await redis.get("id_newuser_projectservice");
  if (cacheNewUserId == null) {
    newUserId = "0";
  } else {
    newUserId = cacheNewUserId;
  }
  log.info("newUser lastId:", newUserId);

  // * Listen Stream
  const result = await redis.xread("block", 0, "STREAMS", "newUser", newUserId);

  const [key, messages] = result[0]; // key = nama streamnya

  if (key == "newUser") {
    messages.forEach(newUserProcess);
  }

  // Pass the last id of the results to the next round.
  await eventConsumer(messages[messages.length - 1][0]);
}

module.exports = eventConsumer;
