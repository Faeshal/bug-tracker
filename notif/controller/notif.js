require("pretty-error").start();
const Notif = require("../models/Notif");
const asyncHandler = require("express-async-handler");
const log = require("log4js").getLogger("notif");
const _ = require("underscore");
log.level = "info";

// * @route GET /api/v1/notifications
// @desc    get notifications
// @access  Private[admin,user]
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const data = await Notif.find({});
  res.status(200).json({
    success: true,
    data,
  });
});
