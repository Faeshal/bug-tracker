require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const Card = require("../models").card;
const Comment = require("../models").comment;
const _ = require("underscore");
const { ErrorResponse } = require("../middleware/errorHandler");
const publish = require("../event/publisher");
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
  let { comment } = card;
  let totalComment = ++comment;

  // * save to comment
  const result = await Comment.create({ cardId, content, userId: id });

  // * update counting comment in card
  await Card.update({ comment: totalComment }, { where: { id: cardId } });

  // * publish event
  publish({
    stream: "newComment",
    id: result.id,
    userId: id,
    cardId,
    content,
    totalComment,
  });

  res.status(201).json({
    success: true,
    message: "comment created",
  });
});

// * @route GET /api/v1/comments/cards/:id
// @desc    get comment by card id
// @access  Private[user]
exports.getCommentByCardId = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const data = await Comment.findAll({ where: { cardId: id } });
  res.status(201).json({
    success: true,
    data,
  });
});
