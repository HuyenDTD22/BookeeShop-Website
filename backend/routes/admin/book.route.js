const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/book.controller");
const bookValidate = require("../../validates/admin/book.validate");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch(
  "/change-status/:id",
  bookValidate.changeStatus,
  controller.changeStatus
);

router.patch("/change-multi", bookValidate.changeMulti, controller.changeMulti);

router.post("/create", bookValidate.create, controller.create);

router.patch("/edit/:id", bookValidate.edit, controller.edit);

router.delete("/delete/:id", controller.delete);

module.exports = router;
