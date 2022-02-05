require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const log = require("log4js").getLogger("notif");
const _ = require("underscore");
log.level = "info";
const db = require("nano")("http://admin:root@localhost:5984/bugtracker-notif");
const axios = require("axios").default;

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

// * @route GET /api/v1/notifications/:id
// @desc    get detail notification
// @access  Private
exports.getNotification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const notifData = await db.list({ key: id, include_docs: true });

  // ! sync communication
  // * Request detail project data from : project service
  const projectId = notifData.rows[0].doc.projectId;
  const result = await axios
    .get(`http://localhost:2000/api/v1/projects/${projectId}`)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.status);
      }
    });

  if (result == undefined) {
    return res
      .status(500)
      .json({ success: false, message: "service was down, come back later.." });
  }

  const rawData = result.data.data;

  // * combine data
  const fmtData = _.extend(notifData, { detailProject: rawData });

  res.status(200).json({
    success: true,
    data: fmtData,
  });
});
