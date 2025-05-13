const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const ForgotPassword = require("../../models/forgot-password.model");

const systemConfig = require("../../config/system");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

//[POST] /admin/auth/login - Đăng nhập
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

    const payload = {
      id: user._id,
      email: user.email,
      role_id: user.role_id,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
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
      message: "Đã xảy ra lỗi khi đăng nhập!",
      error: error.message,
    });
    return;
  }
};

//[GET] /admin/auth/logout - Đăng xuất
module.exports.logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.json({
      code: 200,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi đăng xuất!",
      error: error.message,
    });
  }
};

//[GET] /admin/auth/info - Lấy thông tin của 1 tài khoản
module.exports.getAuthInfo = async (req, res) => {
  try {
    const user = await Account.findById(res.locals.user.id).select(
      "-password -token"
    );
    const role = await Role.findById(res.locals.role.id);
    res.json({
      code: 200,
      user,
      role,
    });
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: "Đã xảy ra lỗi khi lấy thông tin tài khoản!",
      error: error.message,
    });
  }
};

// [POST] /admin/auth/password/forgot - Quên mật khẩu
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const account = await Account.findOne({
      email: email,
      deleted: false,
    });

    if (!account) {
      res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
      return;
    }

    const otp = generateHelper.generateRandomNumber(6);
    const timeExpire = 5;

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000,
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).<br/>
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
  `;

    sendMailHelper.sendMail(email, subject, html);

    res.json({
      code: 200,
      message: "Mã OTP đã được gửi đến email của bạn!",
    });
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};

// [POST] /admin/auth/password/otp - Xác nhận OTP
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!",
      });
      return;
    }

    const account = await Account.findOne({
      email: email,
    });

    const payload = {
      id: account._id,
      email: account.email,
      role_id: account.role_id,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      code: 200,
      message: "Xác thực thành công!",
      token: token,
    });
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};

// [POST] /admin/auth/password/reset - Đổi mật khẩu
module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const password = req.body.password;

    const decoded = jwt.verify(token, JWT_SECRET);
    const account = await Account.findById(decoded.id);

    if (!account) {
      return res.json({
        code: 400,
        message: "Người dùng không tồn tại!",
      });
    }

    if (md5(password) === account.password) {
      return res.json({
        code: 400,
        message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ.",
      });
    }

    await Account.updateOne(
      { _id: account._id },
      {
        password: md5(password),
      }
    );

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi đổi mật khẩu!",
      error: error.message,
    });
  }
};
