const Order = require("../../models/order.model");
const Notification = require("../../models/notification.model");

const searchHelper = require("../../helpers/search");
const orderHelper = require("../../helpers/order");

// [GET] /admin/order - Lấy danh sách đơn hàng
exports.index = async (req, res) => {
  try {
    const { search = "", status, startDate, endDate } = req.query;

    let query = { deleted: false };

    const objectSearch = searchHelper({ keyword: search });
    if (objectSearch.keyword) {
      query.$or = [
        { _id: objectSearch.keyword },
        { "userInfo.fullName": objectSearch.regex },
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

    const orders = await Order.find(query)
      .populate("user_id", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// [GET] /admin/order/detail/:id - Lấy chi tiết một đơn hàng
exports.detail = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, deleted: false })
      .populate("user_id", "fullName email phone")
      .populate("books.book_id", "title thumbnail price");

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

// [PATCH] /admin/order/change-status/:id - Cập nhật trạng thái đơn hàng
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

    const notification = await orderHelper.createOrderStatusNotification(
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

// [PATCH] /admin/order/change-multi - Cập nhật trạng thái của nhiều đơn hàng
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
      const notification = await orderHelper.createOrderStatusNotification(
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

// [DELETE] /admin/order/delete/:id - Xóa đơn hàng
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
