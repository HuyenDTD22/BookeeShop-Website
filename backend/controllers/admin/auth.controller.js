const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

//[POST] /admin/auth/login - Tính năng đăng nhập
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
      return;
    }

    if (md5(password) != user.password) {
      res.json({
        code: 400,
        message: "Sai mật khẩu!",
      });
      return;
    }

    if (user.status == "inactive") {
      res.json({
        code: 400,
        message: "tài khoản đã bị khoá!",
      });
      return;
    }

    // Tạo payload cho JWT
    const payload = {
      id: user._id,
      email: user.email,
      role_id: user.role_id,
    };

    // Tạo JWT
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d", // Token hết hạn sau 1 ngày
    });

    // Lưu JWT vào cookie với httpOnly
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS trong production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Dùng Lax trong development
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error,
    });
    return;
  }
};

//[GET] /admin/auth/logout - Tính năng đăng xuất
module.exports.logout = (req, res) => {
  // Xóa cookie jwt
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.json({
    code: 200,
    message: "Đăng xuất thành công!",
  });
};
