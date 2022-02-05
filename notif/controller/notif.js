require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const log = require("log4js").getLogger("avatar");
log.level = "info";

// * @route GET /api/v1/notifications
// @desc    post dummy
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "OK",
  });
});
