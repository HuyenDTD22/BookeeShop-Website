const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

router.patch("/permissions", controller.permissions); // Xây dựng nhóm phân quyền

router.delete("/delete/:id", controller.delete);

module.exports = router;
