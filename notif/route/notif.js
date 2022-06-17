const express = require("express");
const router = express.Router();
const notifController = require("../controller/notif");

router.get("/api/v1/notifications", pro, notifController.getNotifications);

module.exports = router;
