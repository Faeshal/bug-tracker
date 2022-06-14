const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { protect } = require("../middleware/auth");

router.post("/api/v1/auth/register", authController.register);

router.post("/api/v1/auth/login", authController.login);

router.post("/api/v1/auth/refresh", authController.refresh);

router.get("/api/v1/auth/profiles", protect, authController.getAccount);

module.exports = router;
