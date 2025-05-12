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

  if (Object.keys(message).length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.edit = (req, res, next) => {
  const errors = {};

  if (!req.body.fullName) {
    errors.fullName = "Vui lòng nhập họ tên!";
  }

  if (!req.body.email) {
    errors.email = "Vui lòng nhập email!";
  }

  if (!req.body.phone) {
    errors.phone = "Vui lòng nhập số điện thoại!";
  }

  if (Object.keys(message).length > 0) {
    return res.status(400).json({ errors });
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

  if (Object.keys(message).length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
