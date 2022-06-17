const express = require("express");
const router = express.Router();
const projectController = require("../controller/project");
const { protect, AuthorizeRole } = require("../middleware/auth");

router.get("/api/v1/projects", protect, projectController.getProjects);
router.post(
  "/api/v1/projects",
  protect,
  AuthorizeRole("user"),
  projectController.createProject
);
router.get("/api/v1/projects/:id", protect, projectController.getProject);
router.put(
  "/api/v1/projects/:id",
  protect,
  AuthorizeRole("user"),
  projectController.updateProject
);
router.delete(
  "/api/v1/projects/:id",
  protect,
  AuthorizeRole("user"),
  projectController.deleteProject
);

module.exports = router;
