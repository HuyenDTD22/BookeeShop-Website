const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Book = require("../../models/book.model");
const Category = require("../../models/category.model");
const Rating = require("../../models/rating.model");
const Account = require("../../models/account.model");
const Notification = require("../../models/notification.model");

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// [GET] /admin/dashboard/stats - Thống kê
exports.index = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Xác định khoảng thời gian
    const queryDate = {};
    if (startDate && isValidDate(startDate)) {
      queryDate.$gte = new Date(startDate);
    }
    if (endDate && isValidDate(endDate)) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      queryDate.$lte = end;
    }

    // Điều kiện match cho Order
    const orderMatch = { deleted: false };
    if (Object.keys(queryDate).length > 0) {
      orderMatch.createdAt = queryDate;
    }

    // Điều kiện match cho Notification
    const notificationMatch = { status: "sent" };
    if (Object.keys(queryDate).length > 0) {
      notificationMatch.createdAt = queryDate;
    }

    // Doanh thu
    const revenue = await Order.aggregate([
      { $match: { ...orderMatch, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Số người dùng mới
    let newUsers = 0;
    try {
      if (Object.keys(queryDate).length > 0) {
        newUsers = await User.countDocuments({
          deleted: false,
          createdAt: queryDate,
        });
      } else {
        newUsers = await User.countDocuments({ deleted: false });
      }
    } catch (error) {
      console.error("Error counting users:", error.message);
    }

    // Số đơn hàng
    const orderStats = await Order.aggregate([
      { $match: orderMatch },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    console.log("Order Stats:", orderStats);
    const totalOrders = orderStats.reduce((sum, stat) => sum + stat.count, 0);
    const orderStatusBreakdown = {
      pending: 0,
      delivered: 0,
      completed: 0,
      cancelled: 0,
    };
    orderStats.forEach((stat) => {
      orderStatusBreakdown[stat._id] = stat.count;
    });

    // Số sách
    const totalBooks = await Book.countDocuments({ deleted: false });
    const inStockBooks = await Book.countDocuments({
      deleted: false,
      stock: { $gt: 0 },
    });

    // Số danh mục
    const totalCategories = await Category.countDocuments({ deleted: false });

    // Số đánh giá
    const totalRatings = await Rating.countDocuments({ deleted: false });

    // Số nhân viên
    const totalAdmins = await Account.countDocuments({
      deleted: false,
      role_id: { $exists: true },
    });

    // Số thông báo và tỷ lệ đọc
    let notifications = [];
    let totalNotifications = 0;
    try {
      notifications = await Notification.find(notificationMatch);
      totalNotifications = notifications.length;
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }

    let totalRead = 0;
    let totalTarget = 0;
    for (const notification of notifications) {
      const readCount = notification.readBy.length;
      let targetCount;
      if (notification.target.type === "all") {
        try {
          targetCount = await User.countDocuments({ deleted: false });
        } catch (error) {
          console.error("Error counting target users:", error.message);
          targetCount = 0;
        }
      } else {
        targetCount = notification.target.userIds.length;
      }
      totalRead += readCount;
      totalTarget += targetCount;
    }
    const readRate = totalTarget > 0 ? (totalRead / totalTarget) * 100 : 0;

    // Doanh thu theo ngày
    const revenueChart = await Order.aggregate([
      { $match: { ...orderMatch, status: "completed" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Người đăng ký theo ngày
    let userChart = [];
    try {
      if (Object.keys(queryDate).length > 0) {
        userChart = await User.aggregate([
          { $match: { deleted: false, createdAt: queryDate } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);
      } else {
        userChart = await User.aggregate([
          { $match: { deleted: false } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);
      }
    } catch (error) {
      console.error("Error generating user chart:", error.message);
    }

    // Top 5 sách bán chạy
    const topBooks = await Order.aggregate([
      { $match: orderMatch },
      { $unwind: "$books" },
      {
        $group: {
          _id: "$books.book_id",
          totalSold: { $sum: "$books.quantity" },
        },
      },
      {
        $lookup: {
          from: "book",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      { $match: { "book.deleted": false } },
      {
        $project: {
          title: "$book.title",
          totalSold: 1,
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Đơn hàng pending quá 24 giờ
    const pendingOrders = await Order.countDocuments({
      status: "pending",
      deleted: false,
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const pendingOrdersList = await Order.find({
      status: "pending",
      deleted: false,
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .select("_id userInfo createdAt")
      .lean();

    // Sách tồn kho thấp
    const lowStockBooks = await Book.countDocuments({
      deleted: false,
      stock: { $lt: 10, $gte: 0 },
    });
    const lowStockBooksList = await Book.find({
      deleted: false,
      stock: { $lt: 10, $gte: 0 },
    })
      .select("title stock")
      .lean();

    // Thông báo tỷ lệ đọc thấp
    let lowReadNotifications = 0;
    try {
      const lowReadMatch = { status: "sent" };
      if (Object.keys(queryDate).length > 0) {
        lowReadMatch.createdAt = queryDate;
      }
      lowReadNotifications = await Notification.countDocuments({
        ...lowReadMatch,
        $expr: {
          $lt: [
            { $divide: [{ $size: "$readBy" }, { $size: "$target.userIds" }] },
            0.5,
          ],
        },
      });
    } catch (error) {
      console.error("Error counting low read notifications:", error.message);
    }

    // Thông báo gần đây
    let recentNotifications = [];
    try {
      recentNotifications = await Notification.find({
        deleted: false,
      })
        .select("title type status sendAt")
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (error) {
      console.error("Error fetching recent notifications:", error.message);
    }

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          revenue: revenue[0]?.total || 0,
          newUsers,
          orders: {
            total: totalOrders,
            breakdown: orderStatusBreakdown,
          },
          books: {
            total: totalBooks,
            inStock: inStockBooks,
          },
          categories: totalCategories,
          ratings: totalRatings,
          admins: totalAdmins,
          notifications: {
            total: totalNotifications,
            readRate: readRate.toFixed(2),
          },
        },
        charts: {
          revenue: revenueChart.map((item) => ({
            date: item._id,
            value: item.revenue,
          })),
          users: userChart.map((item) => ({
            date: item._id,
            value: item.count,
          })),
          orderStatus: Object.entries(orderStatusBreakdown).map(
            ([status, count]) => ({
              status,
              count,
            })
          ),
          topBooks: topBooks.map((item) => ({
            title: item.title,
            totalSold: item.totalSold,
          })),
        },
        alerts: {
          pendingOrders: {
            count: pendingOrders,
            list: pendingOrdersList.map((order) => ({
              id: order._id,
              userName: order.userInfo?.fullName || "Unknown",
              createdAt: order.createdAt,
            })),
          },
          lowStockBooks: {
            count: lowStockBooks,
            list: lowStockBooksList.map((book) => ({
              title: book.title,
              stock: book.stock,
            })),
          },
          lowReadNotifications,
        },
        recentNotifications: recentNotifications.map((notification) => ({
          _id: notification._id,
          title: notification.title,
          type: notification.type,
          status: notification.status,
          sendAt: notification.sendAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy dữ liệu Dashboard!",
      error: error.message,
    });
  }
};
