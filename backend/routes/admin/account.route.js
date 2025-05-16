const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch(
  "/change-status/:id",
  validate.changeStatus,
  controller.changeStatus
);

router.patch("/change-multi", validate.changeMulti, controller.changeMulti);

router.post("/create", validate.create, controller.create);

router.patch("/edit/:id", validate.edit, controller.edit);

router.delete("/delete/:id", controller.delete);

router.patch(
  "/my-account/:id",
  validate.EditMyAccount,
  controller.EditMyAccount
);

module.exports = router;
