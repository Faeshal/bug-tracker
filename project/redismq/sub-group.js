require("pretty-error").start();
const log = require("log4js").getLogger("sub-redis");
log.level = "info";
const Redis = require("ioredis");
const redis = new Redis();

async function redisSub() {
  // block artinya blocking dan 0 setelahnya artinya ga ada timeout (aka slalu listen)
  // stream setelahnya itu by default
  // dan $ di akhir artinya bakal grab hanya message terakhir saja, kalau 0 semua message muncul

  // * 1. listen to group , try catch just in case group not exist yet

  try {
    while (true) {
      var dataArr = await redis.xreadgroup(
        "GROUP",
        "userGroup",
        "projectService",
        "BLOCK",
        "0",
        "STREAMS",
        "userStream",
        ">"
      );
      log.info(dataArr);

      if (dataArr !== null) {
        for (datas of dataArr) {
          const rawData = datas[1];
          for (data of rawData) {
            const key = data[0];
            const arr = data[1];
            let obj = {
              key,
              data: JSON.parse(arr[1]),
            };
            log.info("incoming data 📩:", obj);

            // const ack = await redis.xack("userStream", "userGroup", key);
            // log.info("ack:", ack);
          }
        }

        const info = await redis.xinfo("CONSUMERS", "userStream", "userGroup");
        log.info("consumers ▶️:", info);
      }
    }
  } catch (err) {
    log.error(err);
  }
}

// redisSub();

module.exports = redisSub;
