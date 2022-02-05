const express = require("express");
const router = express.Router();
const notifController = require("../controller/notif");

router.post("/api/v1/notifications", notifController.getNotifications);

module.exports = router;
