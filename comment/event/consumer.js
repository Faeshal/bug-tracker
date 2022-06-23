require("pretty-error").start();
const User = require("../models").user;
const Project = require("../models").project;
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
  const setId = await redis.set("id_newuser_commentservice", key);
  log.info("set cache userId 💾:", setId);

  // * business logic
  let userObj = _.omit(rawObj, "stream");
  const user = await User.findOne({ where: { id: userObj.id } });
  if (!user) {
    await User.create(userObj);
  }
};

const newProjectProcess = async (message) => {
  const key = message[0];
  const rawArr = message[1];
  const rawObj = JSON.parse(rawArr[1]);
  log.info("incoming data 📩:", rawObj);

  // * Set cache Last Stream Id
  const setId = await redis.set("id_newproject_commentservice", key);
  log.info("set cache projectId 💾:", setId);

  // * business logic
  let finalObj = _.omit(rawObj, "stream");
  const project = await Project.findOne({ where: { id: finalObj.id } });
  if (!project) {
    await Project.create(finalObj);
  }
};

// * Stream Consumer
async function eventConsumer() {
  // * newUser stream
  let newUserId;
  const cacheNewUserId = await redis.get("id_newuser_commentservice");
  if (cacheNewUserId == null) {
    newUserId = "0";
  } else {
    newUserId = cacheNewUserId;
  }
  log.info("newUser lastId:", newUserId);

  // * newProject stream
  let newProjectId;
  const cacheNewProjectId = await redis.get("id_newproject_commentservice");
  if (cacheNewProjectId == null) {
    newProjectId = "0";
  } else {
    newProjectId = cacheNewProjectId;
  }
  log.info("newProject lastId:", newProjectId);

  // * Listen Stream
  const result = await redis.xread(
    "block",
    0,
    "STREAMS",
    "newUser",
    "newProject",
    newUserId,
    newProjectId
  );

  const [key, messages] = result[0]; // key = nama streamnya

  if (key == "newUser") {
    messages.forEach(newUserProcess);
  }

  if (key == "newProject") {
    messages.forEach(newProjectProcess);
  }

  // Pass the last id of the results to the next round.
  await eventConsumer(messages[messages.length - 1][0]);
}

module.exports = eventConsumer;
