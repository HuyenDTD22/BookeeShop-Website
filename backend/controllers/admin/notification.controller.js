const mongoose = require("mongoose");
const Notification = require("../../models/notification.model");
const User = require("../../models/user.model");
const Account = require("../../models/account.model");

// Lấy danh sách tất cả thông báo
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("createdBy", "fullName email") // Lấy thông tin admin
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
    return res.status(200).json({
      code: 200,
      message: "Lấy danh sách thông báo thành công",
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Lấy chi tiết một thông báo
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    const notification = await Notification.findById(id)
      .populate("createdBy", "fullName email") // Admin
      .populate("readBy", "fullName email"); // Khách hàng đã đọc
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Lấy chi tiết thông báo thành công",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Tạo thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const { title, content, type, target, sendAt } = req.body;

    // Validate dữ liệu
    if (!title || title.trim().length === 0 || title.length > 200) {
      return res.status(400).json({
        code: 400,
        message: "Tiêu đề là bắt buộc và không được vượt quá 200 ký tự",
      });
    }
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Nội dung là bắt buộc",
      });
    }
    if (!["system", "promotion", "personal"].includes(type)) {
      return res.status(400).json({
        code: 400,
        message: "Loại thông báo không hợp lệ",
      });
    }
    if (!target || !["all", "group", "specific"].includes(target.type)) {
      return res.status(400).json({
        code: 400,
        message: "Đối tượng không hợp lệ",
      });
    }
    if (sendAt && new Date(sendAt) <= new Date()) {
      return res.status(400).json({
        code: 400,
        message: "Thời gian gửi phải trong tương lai",
      });
    }
    if (
      target.type === "specific" &&
      (!target.userIds || target.userIds.length === 0)
    ) {
      return res.status(400).json({
        code: 400,
        message: "Danh sách userIds là bắt buộc khi target là specific",
      });
    }

    const notification = new Notification({
      title,
      content,
      type,
      target,
      sendAt,
      status: sendAt ? "scheduled" : "draft",
      createdBy: res.locals.user._id, // Lấy từ middleware requireAuthAdmin (Account)
    });

    await notification.save();

    return res.status(201).json({
      code: 201,
      message: "Tạo thông báo thành công",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Cập nhật thông báo
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, target, sendAt } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    // Validate dữ liệu
    if (!title || title.trim().length === 0 || title.length > 200) {
      return res.status(400).json({
        code: 400,
        message: "Tiêu đề là bắt buộc và không được vượt quá 200 ký tự",
      });
    }
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Nội dung là bắt buộc",
      });
    }
    if (!["system", "promotion", "personal"].includes(type)) {
      return res.status(400).json({
        code: 400,
        message: "Loại thông báo không hợp lệ",
      });
    }
    if (!target || !["all", "group", "specific"].includes(target.type)) {
      return res.status(400).json({
        code: 400,
        message: "Đối tượng không hợp lệ",
      });
    }
    if (sendAt && new Date(sendAt) <= new Date()) {
      return res.status(400).json({
        code: 400,
        message: "Thời gian gửi phải trong tương lai",
      });
    }
    if (
      target.type === "specific" &&
      (!target.userIds || target.userIds.length === 0)
    ) {
      return res.status(400).json({
        code: 400,
        message:
          "Danh sách.vnDanh sách userIds là bắt buộc khi target là specific",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
      });
    }
    if (notification.status === "sent") {
      return res.status(400).json({
        code: 400,
        message: "Không thể cập nhật thông báo đã gửi",
      });
    }

    notification.title = title;
    notification.content = content;
    notification.type = type;
    notification.target = target;
    notification.sendAt = sendAt;
    notification.status = sendAt ? "scheduled" : "draft";
    await notification.save();

    return res.status(200).json({
      code: 200,
      message: "Cập nhật thông báo thành công",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Cập nhật trạng thái của một thông báo
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    // Validate status
    if (!["draft", "sent", "scheduled", "canceled"].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: "Trạng thái không hợp lệ",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
      });
    }

    notification.status = status;
    await notification.save();

    return res.status(200).json({
      code: 200,
      message: "Cập nhật trạng thái thông báo thành công",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Cập nhật trạng thái của nhiều thông báo
exports.updateMultipleStatuses = async (req, res) => {
  try {
    const { ids, status } = req.body;

    // Validate dữ liệu
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Danh sách ID phải là mảng và không được rỗng",
      });
    }
    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        code: 400,
        message: "Một hoặc nhiều ID không hợp lệ",
      });
    }
    if (!["draft", "sent", "scheduled", "canceled"].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: "Trạng thái không hợp lệ",
      });
    }

    const result = await Notification.updateMany(
      { _id: { $in: ids } },
      { status }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy thông báo nào để cập nhật",
      });
    }

    return res.status(200).json({
      code: 200,
      message: `Cập nhật trạng thái cho ${result.modifiedCount} thông báo thành công`,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Gửi thông báo ngay lập tức
exports.sendNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
      });
    }
    if (notification.status === "sent") {
      return res.status(400).json({
        code: 400,
        message: "Thông báo đã được gửi trước đó",
      });
    }

    // Lấy danh sách người nhận (User - khách hàng)
    let recipients = [];
    if (notification.target.type === "all") {
      recipients = await User.find({ deleted: false }).select("_id");
    } else if (notification.target.type === "group") {
      // Giả định groupId là một thuộc tính của User (ví dụ: "vip", "new_user")
      recipients = await User.find({
        groupId: notification.target.groupId,
        deleted: false,
      }).select("_id");
    } else if (notification.target.type === "specific") {
      recipients = await User.find({
        _id: { $in: notification.target.userIds },
        deleted: false,
      }).select("_id");
    }

    // Cập nhật trạng thái và lưu danh sách người nhận
    notification.status = "sent";
    notification.sendAt = new Date();
    notification.target.userIds = recipients.map((user) => user._id);
    await notification.save();

    // TODO: Tích hợp gửi thông báo qua in-app/email/push
    // Ví dụ: sendEmail(recipients, notification);

    return res.status(200).json({
      code: 200,
      message: "Gửi thông báo thành công",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Lên lịch gửi thông báo
exports.scheduleNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { sendAt } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    // Validate sendAt
    if (!sendAt) {
      return res.status(400).json({
        code: 400,
        message: "Thời gian gửi là bắt buộc",
      });
    }
    if (new Date(sendAt) <= new Date()) {
      return res.status(400).json({
        code: 400,
        message: "Thời gian gửi phải trong tương lai",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
      });
    }
    if (notification.status === "sent") {
      return res.status(400).json({
        code: 400,
        message: "Không thể lên lịch cho thông báo đã gửi",
      });
    }

    notification.sendAt = new Date(sendAt);
    notification.status = "scheduled";
    await notification.save();

    // TODO: Tích hợp với node-cron hoặc agenda để xử lý gửi thông báo theo lịch

    return res.status(200).json({
      code: 200,
      message: "Lên lịch gửi thông báo thành công",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Xóa một thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
      });
    }

    if (!["draft", "canceled"].includes(notification.status)) {
      return res.status(400).json({
        code: 400,
        message: "Chỉ có thể xóa thông báo ở trạng thái nháp hoặc đã hủy",
      });
    }

    await Notification.deleteOne({ _id: id });

    return res.status(200).json({
      code: 200,
      message: "Xóa thông báo thành công",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Xóa nhiều thông báo
exports.deleteMultipleNotifications = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate dữ liệu
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Danh sách ID phải là mảng và không được rỗng",
      });
    }
    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        code: 400,
        message: "Một hoặc nhiều ID không hợp lệ",
      });
    }

    const result = await Notification.deleteMany({
      _id: { $in: ids },
      status: { $in: ["draft", "canceled"] }, // Chỉ xóa draft hoặc canceled
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không có thông báo nào được xóa",
      });
    }

    return res.status(200).json({
      code: 200,
      message: `Xóa ${result.deletedCount} thông báo thành công`,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Lấy danh sách khách hàng đã đọc thông báo
exports.getReadByUsers = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    const notification = await Notification.findById(id).populate(
      "readBy",
      "fullName email"
    );
    if (!notification) {
      return res.status(404).json({
        code: 404,
        message: "Thông báo không tồn tại",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Lấy danh sách khách hàng đã đọc thành công",
      data: notification.readBy,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

// Xem thống kê thông báo
exports.getNotificationStats = async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      {
        $facet: {
          byType: [
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          readStats: [
            {
              $project: {
                readCount: { $size: "$readBy" },
                targetCount: {
                  $cond: {
                    if: { $eq: ["$target.type", "all"] },
                    then: await User.countDocuments({ deleted: false }),
                    else: { $size: "$target.userIds" },
                  },
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRead: { $sum: "$readCount" },
                totalTarget: { $sum: "$targetCount" },
              },
            },
          ],
        },
      },
    ]);

    const result = {
      byType: stats[0].byType,
      byStatus: stats[0].byStatus,
      readRate:
        stats[0].readStats[0].totalTarget > 0
          ? (stats[0].readStats[0].totalRead /
              stats[0].readStats[0].totalTarget) *
            100
          : 0,
    };

    return res.status(200).json({
      code: 200,
      message: "Lấy thống kê thông báo thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: `Lỗi server: ${error.message}`,
    });
  }
};
