const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/account.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.index);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.create,
  controller.create
); //Thêm mới tài khoản

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.edit,
  controller.edit
); //Tính năng chỉnh sửa tài khoản

module.exports = router;
