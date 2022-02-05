const express = require("express");
const router = express.Router();
const projectController = require("../controller/project");

router.post("/api/v1/projects", projectController.createProject);

module.exports = router;
