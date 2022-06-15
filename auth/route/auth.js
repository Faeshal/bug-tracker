const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { protect, AuthorizeRole } = require("../middleware/auth");

router.post("/api/v1/auth/register", authController.register);

router.post("/api/v1/auth/login", authController.login);

router.post("/api/v1/auth/refresh", authController.refresh);

router.get("/api/v1/auth/profiles", protect, authController.getAccount);

router.get("/api/v1/auth/logout", protect, authController.logout);

router.get(
  "/api/v1/auth/users",
  protect,
  AuthorizeRole("admin"),
  authController.getUsers
);

router.get("/api/v1/auth/users/:id", protect, authController.getUser);

module.exports = router;
