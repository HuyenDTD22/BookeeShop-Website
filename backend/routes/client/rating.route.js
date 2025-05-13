const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/rating.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");
const ratingValidate = require("../../validates/client/rating.validate");

router.get(
  "/user-ratings",
  authMiddleware.requireAuth,
  controller.getUserRatings
);

router.get("/:bookId", ratingValidate.index, controller.index);

router.post(
  "/create",
  authMiddleware.requireAuth,
  ratingValidate.create,
  controller.create
);

router.patch(
  "/update/:ratingId",
  authMiddleware.requireAuth,
  ratingValidate.update,
  controller.update
);

router.delete(
  "/delete/:ratingId",
  authMiddleware.requireAuth,
  ratingValidate.delete,
  controller.delete
);

module.exports = router;
