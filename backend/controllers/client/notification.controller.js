const mongoose = require("mongoose");
const Notification = require("../../models/notification.model");

//[GET] /notification - Lấy ra tất cả thông báo của khách hàng
exports.index = async (req, res) => {
  try {
    const userId = req.user._id;
    const userCreatedAt = req.user.createdAt; // Thời điểm tạo tài khoản

    // Điều kiện lọc thông báo dành cho người dùng hiện tại
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

    const notifications = await Notification.find({
      $and: [
        { $or: conditions },
        { status: "sent" },
        {
          $or: [
            { sendAt: { $gte: userCreatedAt } }, // Gửi sau khi tạo tài khoản
            { createdAt: { $gte: userCreatedAt } }, // Hoặc tạo sau khi tạo tài khoản
          ],
        },
      ],
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
    return res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi lấy thông báo!",
      error: error.message,
    });
  }
};

//[GET] /notification/detail/:id - Lấy ra chi tiết 1 thông báo
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

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

    // Đánh dấu đã đọc khi xem chi tiết
    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    const formattedNotification = {
      ...notification.toObject(),
      isRead: true, // Đảm bảo isRead: true sau khi đánh dấu
    };

    return res.status(200).json({
      code: 200,
      message: "Lấy chi tiết thông báo thành công",
      data: formattedNotification,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};

//[PATCH] /notification/:id/read - Đánh dấu thông báo đã đọc
exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

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
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};

//[GET] /notification/unread-count - Lấy ra số lượng thông báo chưa đọc
exports.unreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const userCreatedAt = req.user.createdAt; // Thời điểm tạo tài khoản

    const conditions = [
      { "target.type": "all" }, // Thông báo hệ thống
      { "target.type": "specific", "target.userIds": userId }, // Thông báo cá nhân
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
      $and: [
        { $or: conditions }, // Thông báo nhắm đến người dùng
        { status: "sent" }, // Đã gửi
        { readBy: { $ne: userId } }, // Chưa đọc
        {
          $or: [
            { sendAt: { $gte: userCreatedAt } },
            { createdAt: { $gte: userCreatedAt } },
          ],
        },
      ],
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
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};
