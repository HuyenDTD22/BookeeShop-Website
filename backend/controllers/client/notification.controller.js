const mongoose = require("mongoose");
const Order = require("../../models/order.model");
const Notification = require("../../models/notification.model");

// [GET] /notification
module.exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user._id;

    const notifications = await Notification.find({ user_id })
      .sort({ createdAt: -1 })
      .populate("order_id", "totalPrice status");

    res.status(200).json({
      code: 200,
      message: "Lấy thông báo thành công!",
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /order/notifications/:id/read
module.exports.getDetailNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        code: 400,
        message: "notificationId không hợp lệ",
      });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy thông báo",
      });
    }

    if (notification.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xem thông báo này",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      code: 200,
      message: "Đánh dấu thông báo đã đọc thành công!",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};
