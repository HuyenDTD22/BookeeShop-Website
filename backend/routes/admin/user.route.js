const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");
const userValidate = require("../../validates/admin/user.validate");

router.get("/", userValidate.index, controller.index);

router.get("/detail/:id", userValidate.detail, controller.detail);

router.patch(
  "/change-status/:id",
  userValidate.changeStatus,
  controller.changeStatus
);

router.patch("/change-multi", userValidate.changeMulti, controller.changeMulti);

router.delete("/delete/:id", userValidate.delete, controller.delete);

module.exports = router;
