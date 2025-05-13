module.exports.register = (req, res, next) => {
  let message = "";

  if (!req.body.fullName) {
    message = "Vui lòng nhập họ tên!";
  }

  if (!req.body.email) {
    message = "Vui lòng nhập email!";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    message = "Email không hợp lệ!";
  }

  if (!req.body.address) {
    message = "Vui lòng nhập địa chỉ!";
  }

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

  if (!req.body.phone) {
    message = "Vui lòng nhập số điện thoại!";
  } else if (!/^\d{10}$/.test(req.body.phone)) {
    message = "Số điện thoại không hợp lệ!";
  }

  if (req.body.gender !== "Nam" && req.body.gender !== "Nữ") {
    message = "Vui lòng chọn giới tính!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

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

module.exports.update = (req, res, next) => {
  let message = "";

  if (req.body.phone && !/^\d{10}$/.test(req.body.phone)) {
    message = "Số điện thoại không hợp lệ!";
  }

  if (req.body.password) {
    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        req.body.password
      )
    ) {
      message =
        "Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 chữ số và 1 ký tự đặc biệt.";
    }

    if (!req.body.oldPassword) {
      message = "Vui lòng nhập mật khẩu cũ!";
    }

    if (!req.body.confirmPassword) {
      message = "Vui lòng nhập xác nhận mật khẩu!";
    } else if (req.body.password !== req.body.confirmPassword) {
      message = "Mật khẩu và xác nhận mật khẩu không khớp!";
    }
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
