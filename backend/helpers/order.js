const Notification = require("../models/notification.model");

async function createOrderStatusNotification(order, status, createdBy) {
  const statusMessages = {
    pending: {
      title: "Đơn hàng của bạn đang chờ xác nhận",
      content: `<p>Đơn hàng #${order._id} đã được đặt thành công và đang chờ xác nhận.</p>`,
    },
    delivered: {
      title: "Đơn hàng của bạn đang được giao",
      content: `<p>Đơn hàng #${order._id} đã được xác nhận và đang được giao đến địa chỉ của bạn.</p>`,
    },
    completed: {
      title: "Đơn hàng của bạn đã hoàn thành",
      content: `<p>Đơn hàng #${order._id} đã hoàn thành. Hy vọng bạn hài lòng với sản phẩm!</p>`,
    },
    cancelled: {
      title: "Đơn hàng của bạn đã bị hủy",
      content: `<p>Đơn hàng #${order._id} đã bị hủy. Vui lòng liên hệ để biết thêm chi tiết.</p>`,
    },
  };

  const message = statusMessages[status];
  if (!message) return null;

  const notification = new Notification({
    title: message.title,
    content: message.content,
    type: "order_status",
    status: "sent",
    target: {
      type: "specific",
      userIds: [order.user_id],
    },
    createdBy,
    sendAt: new Date(),
    readBy: [],
  });

  await notification.save();
  return notification;
}

module.exports = {
  createOrderStatusNotification,
};
