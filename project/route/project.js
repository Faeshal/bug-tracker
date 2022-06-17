const express = require("express");
const router = express.Router();
const projectController = require("../controller/project");

router.get("/api/v1/projects", projectController.getProjects);
// router.post("/api/v1/projects", projectController.createProject);
// router.get("/api/v1/projects/:id", projectController.getProject);
// router.put("/api/v1/projects/:id", projectController.updateProject);
// router.delete("/api/v1/projects/:id", projectController.deleteProject);

module.exports = router;
