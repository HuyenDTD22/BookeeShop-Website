const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/user.controller");

// API để lấy danh sách khách hàng (hỗ trợ tìm kiếm, lọc)
router.get("/", controller.index);

// API để lấy chi tiết một khách hàng
router.get("/:id", controller.detail);

// API để cập nhật trạng thái khách hàng
router.patch("/change-status/:id", controller.changeStatus);

// API để thay đổi trạng thái của nhiều khách hàng cùng lúc
router.patch("/change-multi", controller.changeMulti);

// API để xóa khách hàng (xóa mềm)
router.delete("/:id", controller.delete);

module.exports = router;
