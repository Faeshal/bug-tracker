"use strict";
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const notifRoutes = require("./route/notif");
const log = require("log4js").getLogger("entrypoint");
log.level = "info";
const createProject = require("./consumer/createProject");

// * logger
app.use(morgan("tiny"));

// * Body Parser
app.use(express.json());

//  * Routing
app.use(notifRoutes);

app.get("/", (res) => {
  res.json({ success: true, message: "Notif Service UP!" });
});

//  * SERVER LISTEN
const server = app.listen(PORT, () => {
  log.info(`Notif service is running on port ${PORT}`);
});

// * consumer
createProject();

// * Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  log.error("Error:" + err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});
