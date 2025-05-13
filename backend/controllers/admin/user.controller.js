const User = require("../../models/user.model");

const searchHelper = require("../../helpers/search");

//[GET] /admin/user - Lấy danh sách khách hàng
exports.index = async (req, res) => {
  try {
    const { search = "", status, startDate, endDate } = req.query;

    let query = { deleted: false };

    const objectSearch = searchHelper({ keyword: search });
    if (objectSearch.keyword) {
      query.$or = [
        { fullName: objectSearch.regex },
        { email: objectSearch.regex },
      ];
    }

    // Lọc theo trạng thái
    if (status) {
      query.status = status;
    }

    // Lọc theo khoảng thời gian đăng ký
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách khách hàng!",
      error: error.message,
    });
  }
};

//[GET] /admin/user/detail/:id - Lấy chi tiết một khách hàng
exports.detail = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId, deleted: false }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng!",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy chi tiết khách hàng!",
      error: error.message,
    });
  }
};

//[PATCH] /admin/user/change-status/:id - Cập nhật trạng thái 1 khách hàng
exports.changeStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    const user = await User.findOne({ _id: userId, deleted: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng!",
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái khách hàng thành công!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái khách hàng!",
      error: error.message,
    });
  }
};

//[PATCH] /admin/user/change-multi - Cập nhật trạng thái của nhiều khách hàng
exports.changeMulti = async (req, res) => {
  try {
    const { userIds, status } = req.body;

    const updatedUsers = await User.updateMany(
      { _id: { $in: userIds }, deleted: false },
      { status: status },
      { new: true }
    );

    if (updatedUsers.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng nào để cập nhật!",
      });
    }

    const users = await User.find({
      _id: { $in: userIds },
      deleted: false,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái của nhiều khách hàng thành công!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái của nhiều khách hàng!",
      error: error.message,
    });
  }
};

//[PATCH] /admin/user/delete/:id - Xóa khách hàng
exports.delete = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOneAndUpdate(
      { _id: userId, deleted: false },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng để xóa!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa khách hàng thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa khách hàng!",
      error: error.message,
    });
  }
};
