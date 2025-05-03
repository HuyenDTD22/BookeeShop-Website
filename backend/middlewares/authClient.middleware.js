const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Không tìm thấy token. Vui lòng đăng nhập.",
      });
    }

    // Giải mã token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // // req.user đã được gán trong middleware
    // if (!req.user || !req.user._id) {
    //   return res.status(401).json({
    //     code: 401,
    //     message: "Không tìm thấy thông tin người dùng trong request!",
    //   });
    // }

    // Tìm người dùng dựa trên user_id trong token
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Người dùng không tồn tại",
      });
    }

    // Gán thông tin người dùng vào req.user
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in requireAuth middleware:", error);
    return res.status(401).json({
      code: 401,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};
