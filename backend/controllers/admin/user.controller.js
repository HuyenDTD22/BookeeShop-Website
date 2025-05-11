const User = require("../../models/user.model");

const searchHelper = require("../../helpers/search");

// Lấy danh sách khách hàng (hỗ trợ tìm kiếm và lọc)
exports.index = async (req, res) => {
  try {
    const { search = "", status, startDate, endDate } = req.query;

    // Điều kiện tìm kiếm
    let query = { deleted: false };

    // Sử dụng searchHelper để xử lý tìm kiếm
    const objectSearch = searchHelper({ keyword: search });
    if (objectSearch.keyword) {
      query.$or = [
        { fullName: objectSearch.regex }, // Tìm kiếm theo tên
        { email: objectSearch.regex }, // Tìm kiếm theo email
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

    // Lấy danh sách khách hàng
    const users = await User.find(query)
      .select("-password") // Không trả về password
      .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo (mới nhất trước)

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

// Lấy chi tiết một khách hàng
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

// Cập nhật trạng thái khách hàng
exports.changeStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Trạng thái không hợp lệ! Trạng thái phải là 'active' hoặc 'inactive'.",
      });
    }

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

// Cập nhật trạng thái của nhiều khách hàng cùng lúc
exports.changeMulti = async (req, res) => {
  try {
    const { userIds, status } = req.body;

    // Kiểm tra đầu vào
    if (!Array.isArray(userIds) || !userIds.length || !status) {
      return res.status(400).json({
        success: false,
        message: "Danh sách userIds hoặc trạng thái không hợp lệ!",
      });
    }

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Trạng thái không hợp lệ! Trạng thái phải là 'active' hoặc 'inactive'.",
      });
    }

    // Tìm và cập nhật các khách hàng
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

    // Lấy lại danh sách các khách hàng đã cập nhật để trả về
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

// Xóa khách hàng (xóa mềm)
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
