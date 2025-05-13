const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();
const controller = require("../../controllers/admin/book.controller");
const bookValidate = require("../../validates/admin/book.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch(
  "/change-status/:id",
  bookValidate.changeStatus,
  controller.changeStatus
);

router.patch("/change-multi", bookValidate.changeMulti, controller.changeMulti);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  bookValidate.create,
  controller.create
);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  bookValidate.edit,
  controller.edit
);

router.delete("/delete/:id", controller.delete);

module.exports = router;
