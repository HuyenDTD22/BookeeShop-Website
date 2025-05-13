const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");
const roleValidate = require("../../validates/admin/role.validate");

router.get("/", roleValidate.index, controller.index);

router.get("/detail/:id", roleValidate.detail, controller.detail);

router.patch(
  "/change-status/:id",
  roleValidate.changeStatus,
  controller.changeStatus
);

router.patch("/change-multi", roleValidate.changeMulti, controller.changeMulti);

router.post("/create", roleValidate.create, controller.create);

router.patch("/edit/:id", roleValidate.edit, controller.edit);

router.patch("/permissions", roleValidate.permissions, controller.permissions);

router.delete("/delete/:id", roleValidate.delete, controller.delete);

module.exports = router;
