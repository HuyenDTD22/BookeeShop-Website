module.exports.login = (req, res, next) => {
  let message = "";

  if (!req.body.email) {
    message = "Vui lòng nhập email!";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    message = "Email không hợp lệ!";
  }

  if (!req.body.password) {
    message = "Vui lòng nhập mật khẩu!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.forgotPassword = (req, res, next) => {
  let message = "";

  if (!req.body.email) {
    message = "Vui lòng nhập email!";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    message = "Email không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.otpPassword = (req, res, next) => {
  let message = "";

  if (!req.body.otp) {
    message = "Vui lòng nhập mã OTP!";
  } else if (!/^\d{6}$/.test(req.body.otp)) {
    message = "Mã OTP phải là 6 chữ số!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.resetPassword = (req, res, next) => {
  let message = "";

  if (!req.body.password) {
    message = "Vui lòng nhập mật khẩu!";
  } else if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      req.body.password
    )
  ) {
    message =
      "Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 chữ số và 1 ký tự đặc biệt.";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
