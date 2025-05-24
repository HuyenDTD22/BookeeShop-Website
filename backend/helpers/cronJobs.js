const cron = require("node-cron");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const sendScheduledNotifications = async () => {
  try {
    const now = new Date();
    const notifications = await Notification.find({
      status: "scheduled",
      sendAt: { $lte: now },
    });

    for (const notification of notifications) {
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

      // Cập nhật thông báo
      notification.status = "sent";
      notification.sendAt = now;
      notification.target.userIds = recipients.map((user) => user._id);
      await notification.save();

      console.log(`Notification ${notification._id} sent successfully`);
    }
  } catch (error) {
    console.error("Error sending scheduled notifications:", error);
  }
};

// Chạy mỗi phút
cron.schedule("* * * * *", sendScheduledNotifications);

module.exports = { sendScheduledNotifications };
