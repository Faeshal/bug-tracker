"use strict";
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const notifRoutes = require("./route/notif");
const log = require("log4js").getLogger("entrypoint");
log.level = "info";
const createProject = require("./consumer/createProject");
const { errorHandler } = require("./middleware/errorHandler");

// * logger
app.use(morgan("tiny"));

// * Body Parser
app.use(express.json());

//  * Routing
app.use(notifRoutes);

app.get("/", (res) => {
  res.json({ success: true, message: "Notif Service UP!" });
});

// * Custom Error Handler
app.use(errorHandler);

//  * SERVER LISTEN
app.listen(PORT, () => {
  log.info(`Notif service is running on port ${PORT}`);
});

// * consumer
// createProject();
