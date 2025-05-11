const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/category.controller");
const validate = require("../../validates/category.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.create,
  controller.create
);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.create,
  controller.edit
);

router.delete("/delete/:id", controller.deleteItem); // Tính năng xoá 1 danh mục sản phẩm

module.exports = router;
