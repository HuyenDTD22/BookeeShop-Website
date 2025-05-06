const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/rating.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.get(
  "/user-ratings",
  authMiddleware.requireAuth,
  controller.getUserRatings
);

router.get("/:bookId", controller.index);

router.post("/create", authMiddleware.requireAuth, controller.create);

router.patch(
  "/update/:ratingId",
  authMiddleware.requireAuth,
  controller.update
);

router.delete(
  "/delete/:ratingId",
  authMiddleware.requireAuth,
  controller.delete
);

module.exports = router;
