require("pretty-error").start();
const User = require("../models").user;
const Project = require("../models").project;
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

  if (rawObj.stream == "newUser") {
    // * Set cache Last Stream Id
    const setId = await redis.set("id_newuser_commentservice", key);
    log.info("set cache userId 💾:", setId);
  }

  if (rawObj.stream == "newProject") {
    // * Set cache Last Stream Id
    const setId = await redis.set("id_newproject_commentservice", key);
    log.info("set cache projectId 💾:", setId);
  }

  // * business logic
  if (rawObj.stream == "newUser") {
    let userObj = _.omit(rawObj, "stream");
    const user = await User.findOne({ where: { id: userObj.id } });
    if (!user) {
      await User.create(userObj);
    }
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

async function newUserConsumer() {
  // * newUser stream
  let lastId;
  const cacheIdNewUser = await redis.get("id_newuser_commentservice");
  if (cacheIdNewUser == null) {
    lastId = "0";
  } else {
    lastId = cacheIdNewUser;
  }
  log.info("newUser lastId:", lastId);

  // * newProject stream
  let lastId2;
  const cacheIdProject = await redis.get("id_newproject_commentservice");
  if (cacheIdProject == null) {
    lastId2 = "0";
  } else {
    lastId2 = cacheIdProject;
  }
  log.info("newProject lastId:", lastId2);
  const results = await redis.xread(
    "block",
    0,
    "STREAMS",
    "newUser",
    "newProject",
    lastId,
    lastId2
  );

  const [key, messages] = results[0]; // key = nama streamnya
  messages.forEach(newUserProcess);
  // Pass the last id of the results to the next round.
  await newUserConsumer(messages[messages.length - 1][0]);
}

async function newProjectConsumer() {
  let lastId;
  const cacheNewProject = await redis.get("id_newproject_commentservice");
  if (cacheNewProject == null) {
    lastId = "0";
  } else {
    lastId = cacheNewProject;
  }
  log.info("newProject lastId:", lastId);
  const results = await redis.xread(
    "block",
    0,
    "STREAMS",
    "newProject",
    lastId
  );
  const [key, messages] = results[0];
  messages.forEach(newProjectProcess);
  await newProjectConsumer(messages[messages.length - 1][0]);
}

module.exports = { newUserConsumer, newProjectConsumer };
