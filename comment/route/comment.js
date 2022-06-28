const express = require("express");
const router = express.Router();
const commentController = require("../controller/comment");
const { protect, AuthorizeRole } = require("../middleware/auth");

router.post(
  "/api/v1/comments",
  protect,
  AuthorizeRole("user"),
  commentController.createComment
);

router.get(
  "/api/v1/comments/:id",
  protect,
  AuthorizeRole("user"),
  commentController.getComment
);

router.delete(
  "/api/v1/comments/:id",
  protect,
  AuthorizeRole("user"),
  commentController.deleteComment
);

router.get(
  "/api/v1/comments/cards/:id",
  protect,
  AuthorizeRole("user"),
  commentController.getCommentByCardId
);

module.exports = router;
