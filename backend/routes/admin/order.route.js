const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");

// API để lấy danh sách đơn hàng (hỗ trợ tìm kiếm, lọc, phân trang)
router.get("/", controller.index);

// API để lấy chi tiết một đơn hàng
router.get("/:id", controller.detail);

// API để cập nhật trạng thái đơn hàng
router.patch("/change-status/:id", controller.changeStatus);

// API để thay đổi trạng thái của nhiều đơn hàng cùng lúc
router.patch("/change-multi", controller.changeMulti);

// API để xóa đơn hàng (xóa mềm)
router.delete("/:id", controller.delete);

module.exports = router;
