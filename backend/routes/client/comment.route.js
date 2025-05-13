const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/comment.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const authMiddleware = require("../../middlewares/authClient.middleware");
const commentValidate = require("../../validates/client/comment.validate");

router.get("/:bookId", commentValidate.index, controller.index);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
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
