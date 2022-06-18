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

module.exports = router;
