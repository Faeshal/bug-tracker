require("pretty-error").start();
const User = require("../models").user;
const _ = require("underscore");
const log = require("log4js").getLogger("sub-redis");
log.level = "info";
const Redis = require("ioredis");
const redis = new Redis();

const newUserProcess = async (message) => {
  const key = message[0];
  const rawArr = message[1];
  const rawObj = JSON.parse(rawArr[1]);
  log.info("incoming data 📩:", rawObj);

  // * Set cache Last Stream Id
  const setId = await redis.set("id_newuser_commentservice", key);
  log.info("set cacheId 💾:", setId);

  // * business logic
  let userObj = _.omit(rawObj, "streamName");
  const user = await User.findOne({ where: { id: userObj.id } });
  if (!user) {
    await User.create(userObj);
  }
};

async function consumer() {
  // * newUser stream
  let lastId;
  const cacheIdNewUser = await redis.get("id_newuser_commentservice");
  if (cacheIdNewUser == null) {
    lastId = "0";
  } else {
    lastId = cacheIdNewUser;
  }
  log.info("lastId:", lastId);
  const results = await redis.xread("block", 0, "STREAMS", "newUser", lastId);
  const [key, messages] = results[0]; // key = nama streamnya
  messages.forEach(newUserProcess);
  // Pass the last id of the results to the next round.
  await consumer(messages[messages.length - 1][0]);
}

module.exports = consumer;
