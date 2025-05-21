const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const generateHelper = require("../../helpers/generate");
const authHelper = require("../../helpers/auth");
const sendMailHelper = require("../../helpers/sendMail");

// [POST] /user/register - Đăng ký
module.exports.register = async (req, res) => {
  try {
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
        address: req.body.address,
      });

      user.save();

      const token = authHelper.setAuthCookie(res, user._id);

      res.json({
        code: 200,
        message: "Tạo tài khoản thành công!",
        token: token,
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi đăng ký!",
      error: error.message,
    });
  }
};

// [POST] /user/login - Đăng nhập
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      return res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
    }

    if (md5(password) !== user.password) {
      return res.json({
        code: 400,
        message: "Sai mật khẩu!",
      });
    }

    const token = authHelper.setAuthCookie(res, user._id);

    await Cart.updateOne({
      user_id: user.id,
    });

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi đăng nhập!",
      error: error.message,
    });
  }
};

// [POST] /user/logout - Đăng xuất
module.exports.logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      code: 200,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi đăng xuất!",
      error: error.message,
    });
  }
};

// [POST] /user/password/forgot - Quên mật khẩu
module.exports.forgotPassword = async (req, res) => {
  try {
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

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000,
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

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
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi gửi OTP!",
      error: error.message,
    });
  }
};

// [POST] /user/password/otp - Quên mật khẩu
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

    const user = await User.findOne({
      email: email,
    });

    const token = authHelper.setAuthCookie(res, user._id);

    res.json({
      code: 200,
      message: "Xác thực thành công!",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};

// [POST] /user/password/reset - reset lại mật khẩu
module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.cookies.token;
    const password = req.body.password;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.json({
        code: 400,
        message: "Người dùng không tồn tại!",
      });
    }

    if (md5(password) === user.password) {
      return res.json({
        code: 400,
        message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ.",
      });
    }

    await User.updateOne(
      { _id: user._id },
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

// [GET] /user/info - Lấy ra thông tin cá nhân
module.exports.info = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        code: 401,
        message: "Không tìm thấy thông tin người dùng trong request!",
      });
    }
    const user = await User.findById(req.user._id).select("-password -deleted");

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Người dùng không tồn tại",
      });
    }

    res.json({
      code: 200,
      message: "Lấy thông tin thành công!",
      info: user,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi lấy thông tin tài khoản!",
      error: error.message,
    });
  }
};

// // [PATCH] /user/update - Cập nhật thông tin cá nhân
// module.exports.update = async (req, res) => {
//   try {
//     const user_id = req.user._id;
//     const { fullName, phone, address, avatar } = req.body;

//     const user = await User.findById(user_id);
//     if (!user) {
//       return res.status(404).json({
//         code: 404,
//         message: "Người dùng không tồn tại!",
//       });
//     }

//     // if (password) {
//     //   if (md5(oldPassword) !== user.password) {
//     //     return res.json({
//     //       code: 400,
//     //       message: "Mật khẩu cũ không đúng!",
//     //     });
//     //   }
//     //   user.password = md5(password);
//     // }

//     if (password) {
//       if (!oldPassword) {
//         return res.json({
//           code: 400,
//           message: "Vui lòng nhập mật khẩu cũ!",
//         });
//       }
//       if (md5(oldPassword) !== user.password) {
//         return res.json({
//           code: 400,
//           message: "Mật khẩu cũ không đúng!",
//         });
//       }
//       if (md5(password) === user.password) {
//         return res.json({
//           code: 400,
//           message: "Mật khẩu mới phải khác mật khẩu cũ!",
//         });
//       }
//     }

//     const updateData = {};
//     if (fullName) updateData.fullName = fullName;
//     if (phone) updateData.phone = phone;
//     if (address) updateData.address = address;
//     if (avatar) updateData.avatar = avatar;
//     if (password) updateData.password = user.password;

//     await User.updateOne({ _id: user_id }, updateData);

//     const updatedUser = await User.findById(user_id).select(
//       "-password -deleted"
//     );

//     res.json({
//       code: 200,
//       message: "Cập nhật thông tin thành công!",
//       info: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       code: 500,
//       message: "Đã xảy ra lỗi chỉnh sửa tài khoản!",
//       error: error.message,
//     });
//   }
// };

// [PATCH] /user/update - Cập nhật thông tin cá nhân
module.exports.update = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { fullName, phone, address, password, oldPassword } = req.body;

    console.log("Update request body:", req.body);
    console.log("Uploaded file:", req.file);

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Người dùng không tồn tại!",
      });
    }

    // Kiểm tra mật khẩu nếu có
    if (password) {
      if (!oldPassword) {
        return res.json({
          code: 400,
          message: "Vui lòng nhập mật khẩu cũ!",
        });
      }
      if (md5(oldPassword) !== user.password) {
        return res.json({
          code: 400,
          message: "Mật khẩu cũ không đúng!",
        });
      }
      if (md5(password) === user.password) {
        return res.json({
          code: 400,
          message: "Mật khẩu mới phải khác mật khẩu cũ!",
        });
      }
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (password) updateData.password = md5(password);
    if (req.body.avatar) updateData.avatar = req.body.avatar;

    console.log("Update data:", updateData);

    // Cập nhật người dùng
    const updateResult = await User.updateOne({ _id: user_id }, updateData);
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng để cập nhật!",
      });
    }

    // Lấy thông tin người dùng sau khi cập nhật
    const updatedUser = await User.findById(user_id).select(
      "-password -deleted"
    );

    res.json({
      code: 200,
      message: "Cập nhật thông tin thành công!",
      info: updatedUser,
    });
  } catch (error) {
    console.error("Error in update:", error);
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi chỉnh sửa tài khoản!",
      error: error.message,
    });
  }
};
