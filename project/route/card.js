const express = require("express");
const router = express.Router();
const cardController = require("../controller/card");
const { protect, AuthorizeRole } = require("../middleware/auth");

router.post(
  "/api/v1/projects/cards",
  protect,
  AuthorizeRole("user"),
  cardController.createCard
);

router.get(
  "/api/v1/projects/:id/cards",
  protect,
  cardController.getCardProject
);

module.exports = router;
