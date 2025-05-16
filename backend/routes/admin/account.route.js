const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch(
  "/change-status/:id",
  validate.changeStatus,
  controller.changeStatus
);

router.patch("/change-multi", validate.changeMulti, controller.changeMulti);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.create,
  controller.create
);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.edit,
  controller.edit
);

router.delete("/delete/:id", controller.delete);

router.patch(
  "/my-account/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.EditMyAccount,
  controller.EditMyAccount
);

module.exports = router;
