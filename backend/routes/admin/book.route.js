const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/book.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.create
);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.edit
);

router.delete("/delete/:id", controller.delete);

module.exports = router;
