const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/admin/notification.controller");

// Lấy danh sách tất cả thông báo
router.get("/", notificationController.getAllNotifications);

// Lấy chi tiết một thông báo
router.get("/:id", notificationController.getNotificationById);

// Tạo thông báo mới
router.post("/", notificationController.createNotification);

// Cập nhật thông báo
router.put("/:id", notificationController.updateNotification);

// Cập nhật trạng thái của một thông báo
router.patch("/:id", notificationController.updateNotificationStatus);

// Cập nhật trạng thái của nhiều thông báo
router.patch(
  "/change-status/:id",
  notificationController.updateMultipleStatuses
);

// Gửi thông báo ngay lập tức
router.post("/send/:id", notificationController.sendNotification);

// Lên lịch gửi thông báo
router.post("/schedule/:id", notificationController.scheduleNotification);

// Xóa nhiều thông báo
router.delete("/:id", notificationController.deleteNotification);

// Xóa nhiều thông báo
router.delete(
  "/change-multi",
  notificationController.deleteMultipleNotifications
);

// Lấy danh sách người dùng đã đọc thông báo
router.get("/read/:id", notificationController.getReadByUsers);

// Xem thống kê thông báo
router.get("/stats", notificationController.getNotificationStats);

module.exports = router;
