const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề thông báo là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },
    content: {
      type: String,
      required: [true, "Nội dung thông báo là bắt buộc"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["system", "promotion", "personal", "order_status"],
        message:
          "Loại thông báo phải là 'system', 'promotion', 'personal', hoặc 'order_status'",
      },
      default: "system",
    },
    target: {
      type: {
        type: String,
        enum: ["all", "group", "specific"],
        default: "all",
      },
      groupId: {
        type: String, // ID của nhóm người dùng (nếu target là group)
        default: null,
      },
      userIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Tham chiếu đến collection User
        },
      ], // Danh sách user cụ thể (nếu target là specific)
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "sent", "scheduled", "canceled"],
        message: "Trạng thái phải là draft, sent, scheduled hoặc canceled",
      },
      default: "draft",
    },
    sendAt: {
      type: Date, // Thời gian gửi hoặc lên lịch
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account", // Tham chiếu đến admin tạo thông báo
      required: [true, "Thông báo phải có người tạo"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Danh sách user đã đọc thông báo
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Tạo index để tối ưu tìm kiếm và lọc
notificationSchema.index({ title: "text", content: "text" }); // Hỗ trợ tìm kiếm theo từ khóa
notificationSchema.index({ status: 1, sendAt: 1 }); // Tối ưu cho truy vấn trạng thái và lịch gửi
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
