const mongoose = require("mongoose");
const Notification = require("../../models/notification.model");
const User = require("../../models/user.model");
const Account = require("../../models/account.model");

// [GET] /admin/notification/ - Lấy ra tất cả thông báo (trừ order_status)
exports.index = async (req, res) => {
  try {
    let query = {
      type: { $ne: "order_status" }, // Loại bỏ thông báo order_status
    };

    // Bộ lọc theo type
    if (
      req.query.type &&
      ["system", "promotion", "personal"].includes(req.query.type)
    ) {
      query.type = req.query.type;
    }

    const notifications = await Notification.find(query)
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      code: 200,
      message: "Lấy danh sách thông báo thành công",
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

// [GET] /admin/notification/detail/:id - Lấy chi tiết một thông báo
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

    const notification = await Notification.findById(id)
      .populate("createdBy", "fullName email")
      .populate("readBy", "fullName email");

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
      message: error.message,
    });
  }
};

// [POST] /admin/notification/create - Tạo thông báo mới
exports.create = async (req, res) => {
  try {
    const { title, content, type, target, sendAt } = req.body;

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
      createdBy: res.locals.user._id,
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

// [PUT] /admin/notification/edit/:id - Cập nhật thông báo
exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, target, sendAt } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

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

// [PATCH] /admin/notification/change-status/:id -Lấy tất cả sách Cập nhật trạng thái của một thông báo
exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

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

// [PATCH] /admin/notification/change-multi - Cập nhật trạng thái của nhiều thông báo
exports.changeMulti = async (req, res) => {
  try {
    const { ids, status } = req.body;

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

// [POST] /admin/notification/send/:id - Gửi thông báo ngay lập tức
exports.send = async (req, res) => {
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
    if (notification.status === "sent") {
      return res.status(400).json({
        code: 400,
        message: "Thông báo đã được gửi trước đó",
      });
    }

    // Lấy danh sách người nhận
    let recipients = [];
    if (notification.target.type === "all") {
      recipients = await User.find({ deleted: false }).select("_id");
    } else if (notification.target.type === "group") {
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

    notification.status = "sent";
    notification.sendAt = new Date();
    notification.target.userIds = recipients.map((user) => user._id);
    await notification.save();

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

// [POST] /admin/notification/schelude - Lên lịch gửi thông báo
exports.schedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { sendAt } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "ID thông báo không hợp lệ",
      });
    }

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

// [DELETE] /admin/notification/delete/:id - Xóa một thông báo
exports.delete = async (req, res) => {
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

// [DELETE] /admin/notification/delete-multi - Xóa nhiều thông báo
exports.deleteMulti = async (req, res) => {
  try {
    const { ids } = req.body;

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

// [GET] /admin/notification/read/:id - Lấy danh sách khách hàng đã đọc thông báo
exports.read = async (req, res) => {
  try {
    const { id } = req.params;

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

// [GET] /admin/notification/stats - Xem thống kê thông báo
exports.stats = async (req, res) => {
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
