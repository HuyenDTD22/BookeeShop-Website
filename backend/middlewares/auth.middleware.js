const jwt = require("jsonwebtoken");
const Account = require("../models/account.model");
const Role = require("../models/role.model");

const systemConfig = require("../config/system");

// Secret key để xác thực JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

module.exports.requireAuthAdmin = async (req, res, next) => {
  // Lấy JWT từ cookie
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "Không tìm thấy token. Vui lòng đăng nhập.",
    });
  }

  try {
    // Xác thực JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Tìm user từ payload
    const user = await Account.findOne({ _id: decoded.id }).select("-password");
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Người dùng không tồn tại",
      });
    }

    const role = await Role.findOne({ _id: user.role_id }).select(
      "title permissions"
    );
    if (!role) {
      return res.status(400).json({
        code: 400,
        message: "Không tìm thấy vai trò của người dùng",
      });
    }

    res.locals.user = user;
    res.locals.role = role;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};
