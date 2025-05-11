const mongoose = require("mongoose");
const Notification = require("../../models/notification.model");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Điều kiện lọc thông báo
    const conditions = [
      { "target.type": "all" },
      { "target.type": "specific", "target.userIds": userId },
    ];

    // Chỉ thêm điều kiện group nếu groupId tồn tại
    if (req.user.groupId) {
      conditions.push({
        "target.type": "group",
        "target.groupId": {
          $in: Array.isArray(req.user.groupId)
            ? req.user.groupId
            : [req.user.groupId],
        },
      });
    }

    const notifications = await Notification.find({
      $or: conditions,
      status: "sent",
    })
      .select("title content type status sendAt createdAt readBy")
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    const formattedNotifications = notifications.map((notification) => ({
      ...notification.toObject(),
      isRead: notification.readBy.includes(userId),
    }));

    return res.status(200).json({
      code: 200,
      message: "Lấy danh sách thông báo thành công",
      data: formattedNotifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
      data: null,
    });
  }
};

exports.getDetailNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
        data: null,
      });
    }

    const notification = await Notification.findById(id)
      .select("title content type status sendAt createdAt readBy target")
      .populate("createdBy", "fullName email");

    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
        data: null,
      });
    }

    const isAccessible =
      notification.target.type === "all" ||
      notification.type === "promotion" || // Cho phép tất cả người dùng xem thông báo promotion
      (notification.target.type === "group" &&
        req.user.groupId &&
        String(notification.target.groupId) === String(req.user.groupId)) ||
      (notification.target.type === "specific" &&
        notification.target.userIds &&
        notification.target.userIds.some(
          (id) => String(id) === String(userId)
        ));

    if (!isAccessible) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xem thông báo này",
        data: null,
      });
    }

    if (notification.status !== "sent") {
      return res.status(403).json({
        code: 403,
        message: "Thông báo chưa được gửi",
        data: null,
      });
    }

    const formattedNotification = {
      ...notification.toObject(),
      isRead: notification.readBy.includes(userId),
    };

    return res.status(200).json({
      code: 200,
      message: "Lấy chi tiết thông báo thành công",
      data: formattedNotification,
    });
  } catch (error) {
    console.error("Error in getDetailNotification:", error);
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
      data: null,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
        data: null,
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
        data: null,
      });
    }

    const isAccessible =
      notification.target.type === "all" ||
      (notification.target.type === "group" &&
        req.user.groupId &&
        notification.target.groupId === req.user.groupId) ||
      (notification.target.type === "specific" &&
        notification.target.userIds.includes(userId));

    if (!isAccessible) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền đọc thông báo này",
        data: null,
      });
    }

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    return res.status(200).json({
      code: 200,
      message: "Đánh dấu thông báo đã đọc thành công",
      data: {
        _id: notification._id,
        isRead: true,
      },
    });
  } catch (error) {
    console.error("Error in markAsRead:", error);
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
      data: null,
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const conditions = [
      { "target.type": "all" },
      { "target.type": "specific", "target.userIds": userId },
    ];

    if (req.user.groupId) {
      conditions.push({
        "target.type": "group",
        "target.groupId": {
          $in: Array.isArray(req.user.groupId)
            ? req.user.groupId
            : [req.user.groupId],
        },
      });
    }

    const unreadCount = await Notification.countDocuments({
      $or: conditions,
      status: "sent",
      readBy: { $ne: userId },
    });

    return res.status(200).json({
      code: 200,
      message: "Lấy số lượng thông báo chưa đọc thành công",
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
      data: null,
    });
  }
};
