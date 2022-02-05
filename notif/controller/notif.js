require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const log = require("log4js").getLogger("avatar");
log.level = "info";
const db = require("nano")("http://admin:root@localhost:5984/bugtracker-notif");

// * @route GET /api/v1/notifications
// @desc    post dummy
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const doclist = await db.list({ include_docs: true });
  res.status(200).json({
    success: true,
    totalData: doclist.total_rows,
    data: doclist.rows,
  });
});
