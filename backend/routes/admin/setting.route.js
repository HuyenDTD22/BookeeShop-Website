const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/setting.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.index);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.general
);

module.exports = router;
