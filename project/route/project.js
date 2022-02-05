const express = require("express");
const router = express.Router();
const projectController = require("../controller/project");

router.post("/api/v1/projects", projectController.createProject);

router.get("/api/v1/projects/:id", projectController.getProject);

module.exports = router;
