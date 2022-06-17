"use strict";
const express = require("express");
const app = express();
const PORT = process.env.PORT || 2000;
const morgan = require("morgan");
const paginate = require("express-paginate");
const projectRoutes = require("./route/project");
const { errorHandler } = require("./middleware/errorHandler");
const log = require("log4js").getLogger("entrypoint");
log.level = "info";

// * logger
app.use(morgan("tiny"));

// * Body Parser
app.use(express.json());

// * paginate
app.use(paginate.middleware(3, 50));

//  * Routing
app.use(projectRoutes);

app.get("/", (res) => {
  res.json({ success: true, message: "Project Service UP!" });
});

//  * SERVER LISTEN
const server = app.listen(PORT, () => {
  log.info(`Project service is running on port ${PORT}`);
});

// * Custom Error Handler
app.use(errorHandler);

// * Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  log.error("Error:" + err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});
