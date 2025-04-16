const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.post("/create", controller.create); //Thêm mới 1 nhóm quyền

router.patch("/edit/:id", controller.edit); // Chỉnh sửa nhóm quyền

router.patch("/permissions", controller.permissions); // Xây dựng nhóm phân quyền

module.exports = router;
