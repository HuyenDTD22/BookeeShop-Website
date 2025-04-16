const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

// [POST] /user/register - Đăng kí
module.exports.register = async (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    res.json({
      code: 400,
      message: "Mật khẩu và xác nhận mật khẩu không khớp!",
    });
    return;
  }

  req.body.password = md5(req.body.password);

  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  const existPhone = await User.findOne({
    phone: req.body.phone,
    deleted: false,
  });

  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!",
    });
    return;
  } else if (existPhone) {
    res.json({
      code: 400,
      message: "Số điện thoại đã tồn tại!",
    });
    return;
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      gender: req.body.gender,
    });

    user.save();

    const token = user.tokenUser;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công!",
      token: token,
    });
  }
};

// [POST] /user/login - Đăng nhập
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
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

  if (md5(password) !== user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!",
    });
    return;
  }

  const token = user.tokenUser;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token,
  });
};

// [POST] /user/password/forgot - Quên mật khẩu
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
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

  const otp = generateHelper.generateRandomNumber(6);

  const timeExpire = 5;

  // Lưu data vào database
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60 * 1000,
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Gửi OPT qua email user
  const subject = "Mã OPT xác minh lấy lại mật khẩu";

  const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).<br/>
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
    `;

  sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200,
    message: "Mã OTP đã được gửi đến email của bạn!",
  });
};

// [POST] /user/password/otp - Quên mật khẩu
module.exports.otpPassword = async (req, res) => {
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

  const user = await User.findOne({
    email: email,
  });

  const token = user.tokenUser;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Xác thực thành công!",
    token: token,
  });
};

// [POST] /user/password/reset - reset lại mật khẩu
module.exports.resetPassword = async (req, res) => {
  const token = req.cookies.token;
  const password = req.body.password;

  const user = await User.findOne({
    tokenUser: token,
  });

  if (md5(password) === user.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ.",
    });
    return;
  }

  await User.updateOne(
    {
      tokenUser: token,
    },
    {
      password: md5(password),
    }
  );

  res.json({
    code: 200,
    message: "Đổi mật khẩu thành công!",
  });
};

// [GET] /user/detail - Lấy ra thông tin cá nhân
module.exports.detail = async (req, res) => {
  try {
    const token = req.cookies.token;

    const user = await User.findOne({
      tokenUser: token,
    }).select("-password -tokenUser -deleted");

    res.json({
      code: 200,
      message: "Thành công!",
      info: user,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};
