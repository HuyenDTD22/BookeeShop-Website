const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/comment.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.get("/:bookId", controller.index);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  authMiddleware.requireAuth,
  controller.create
);

router.delete(
  "/delete/:commentId",
  authMiddleware.requireAuth,
  controller.delete
);

module.exports = router;
