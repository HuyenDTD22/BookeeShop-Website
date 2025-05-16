const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/comment.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");
const commentValidate = require("../../validates/client/comment.validate");

router.get("/:bookId", commentValidate.index, controller.index);

router.post(
  "/create",
  authMiddleware.requireAuth,
  commentValidate.create,
  controller.create
);

router.delete(
  "/delete/:commentId",
  authMiddleware.requireAuth,
  commentValidate.delete,
  controller.delete
);

module.exports = router;
