require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const User = require("../models").user;
const Card = require("../models").card;
const Comment = require("../models").comment;
const _ = require("underscore");
const { ErrorResponse } = require("../middleware/errorHandler");
const log = require("log4js").getLogger("comment");
log.level = "info";

// * @route POST /api/v1/comments
// @desc    create new comments
// @access  Private[user]
exports.createComment = asyncHandler(async (req, res, next) => {
  let { content, cardId } = req.body;
  const { id } = req.user;

  // * check valid cardId
  const card = await Card.findOne({ where: { id: cardId } });
  if (!card) {
    return next(new ErrorResponse("invalid cardId", 400));
  }

  // * save to comment
  await Comment.create({ cardId, content, userId: id });

  // * publish event

  res.status(201).json({
    success: true,
    message: "comment created",
  });
});
