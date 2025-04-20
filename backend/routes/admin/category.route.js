const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/category.controller");
const validate = require("../../validates/category.validate");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", validate.create, controller.create);

router.patch("/edit/:id", validate.create, controller.edit); //Chỉnh sửa danh mục sản phẩm

router.delete("/delete/:id", controller.deleteItem); // Tính năng xoá 1 danh mục sản phẩm

module.exports = router;
