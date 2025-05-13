const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/order.controller");
const orderValidate = require("../../validates/admin/order.validate");

router.get("/", orderValidate.index, controller.index);

router.get("/detail/:id", orderValidate.detail, controller.detail);

router.patch(
  "/change-status/:id",
  orderValidate.changeStatus,
  controller.changeStatus
);

router.patch(
  "/change-multi",
  orderValidate.changeMulti,
  controller.changeMulti
);

router.delete("/delete/:id", orderValidate.delete, controller.delete);

module.exports = router;
