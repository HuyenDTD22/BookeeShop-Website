const Order = require("../../models/order.model");
const Notification = require("../../models/notification.model");
const searchHelper = require("../../helpers/search");

// Hàm tạo thông báo trạng thái đơn hàng
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

// Lấy danh sách đơn hàng (hỗ trợ tìm kiếm và lọc, không phân trang)
exports.index = async (req, res) => {
  try {
    const { search = "", status, startDate, endDate } = req.query;

    // Điều kiện tìm kiếm
    let query = { deleted: false };

    // Sử dụng searchHelper để xử lý tìm kiếm
    const objectSearch = searchHelper({ keyword: search });
    if (objectSearch.keyword) {
      query.$or = [
        { _id: objectSearch.keyword }, // Tìm kiếm theo mã đơn hàng
        { "userInfo.fullName": objectSearch.regex }, // Tìm kiếm theo tên khách hàng
      ];
    }

    // Lọc theo trạng thái
    if (status) {
      query.status = status;
    }

    // Lọc theo khoảng thời gian
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Lấy tất cả dữ liệu (không phân trang)
    const orders = await Order.find(query)
      .populate("user_id", "fullName email") // Lấy thông tin user (tên, email)
      .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo (mới nhất trước)

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách đơn hàng!",
      error: error.message,
    });
  }
};

// Lấy chi tiết một đơn hàng
exports.detail = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, deleted: false })
      .populate("user_id", "fullName email phone")
      .populate("books.book_id", "title thumbnail price"); // Lấy thông tin sách

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy chi tiết đơn hàng!",
      error: error.message,
    });
  }
};

// // Cập nhật trạng thái đơn hàng
// exports.changeStatus = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const { status } = req.body;

//     // Kiểm tra trạng thái hợp lệ
//     const validStatuses = ["pending", "delivered", "completed", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Trạng thái không hợp lệ!",
//       });
//     }

//     const order = await Order.findOne({ _id: orderId, deleted: false });
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy đơn hàng!",
//       });
//     }

//     order.status = status;
//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Cập nhật trạng thái đơn hàng thành công!",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng!",
//       error: error.message,
//     });
//   }
// };

// // Cập nhật trạng thái của nhiều đơn hàng cùng lúc
// exports.changeMulti = async (req, res) => {
//   try {
//     const { orderIds, status } = req.body;

//     // Kiểm tra đầu vào
//     if (!Array.isArray(orderIds) || !orderIds.length || !status) {
//       return res.status(400).json({
//         success: false,
//         message: "Danh sách orderIds hoặc trạng thái không hợp lệ!",
//       });
//     }

//     // Kiểm tra trạng thái hợp lệ
//     const validStatuses = ["pending", "delivered", "completed", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Trạng thái không hợp lệ!",
//       });
//     }

//     // Tìm và cập nhật các đơn hàng
//     const updatedOrders = await Order.updateMany(
//       { _id: { $in: orderIds }, deleted: false },
//       { status: status },
//       { new: true }
//     );

//     if (updatedOrders.matchedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy đơn hàng nào để cập nhật!",
//       });
//     }

//     // Lấy lại danh sách các đơn hàng đã cập nhật để trả về
//     const orders = await Order.find({
//       _id: { $in: orderIds },
//       deleted: false,
//     }).populate("user_id", "fullName email");

//     res.status(200).json({
//       success: true,
//       message: "Cập nhật trạng thái của nhiều đơn hàng thành công!",
//       data: orders,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Đã xảy ra lỗi khi cập nhật trạng thái của nhiều đơn hàng!",
//       error: error.message,
//     });
//   }
// };

// Cập nhật trạng thái đơn hàng
exports.changeStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["pending", "delivered", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ!",
      });
    }

    const order = await Order.findOne({ _id: orderId, deleted: false });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    order.status = status;
    await order.save();

    // Tạo thông báo tự động
    const notification = await createOrderStatusNotification(
      order,
      status,
      res.locals.user._id
    );
    if (!notification) {
      console.warn(
        `Không tạo được thông báo cho đơn hàng ${orderId}, trạng thái ${status}`
      );
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng!",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái của nhiều đơn hàng
exports.changeMulti = async (req, res) => {
  try {
    const { orderIds, status } = req.body;

    if (!Array.isArray(orderIds) || !orderIds.length || !status) {
      return res.status(400).json({
        success: false,
        message: "Danh sách orderIds hoặc trạng thái không hợp lệ!",
      });
    }

    const validStatuses = ["pending", "delivered", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ!",
      });
    }

    const orders = await Order.find({
      _id: { $in: orderIds },
      deleted: false,
    });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng nào để cập nhật!",
      });
    }

    const updatedOrders = await Order.updateMany(
      { _id: { $in: orderIds }, deleted: false },
      { status: status },
      { new: true }
    );

    // Tạo thông báo cho từng đơn hàng
    for (const order of orders) {
      const notification = await createOrderStatusNotification(
        order,
        status,
        res.locals.user._id
      );
      if (!notification) {
        console.warn(
          `Không tạo được thông báo cho đơn hàng ${order._id}, trạng thái ${status}`
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái của nhiều đơn hàng thành công!",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái của nhiều đơn hàng!",
      error: error.message,
    });
  }
};

// Xóa đơn hàng (xóa mềm)
exports.delete = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, deleted: false },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để xóa!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa đơn hàng thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa đơn hàng!",
      error: error.message,
    });
  }
};
