module.exports.changeStatus = (req, res, next) => {
  let message = "";

  if (!req.body.status) {
    message = "Vui lòng cung cấp trạng thái!";
  } else if (!["active", "inactive"].includes(req.body.status)) {
    message = "Trạng thái không hợp lệ! Phải là 'active' hoặc 'inactive'.";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.changeMulti = (req, res, next) => {
  let message = "";

  if (
    !req.body.ids ||
    !Array.isArray(req.body.ids) ||
    req.body.ids.length === 0
  ) {
    message = "Vui lòng cung cấp danh sách ID hợp lệ!";
  }

  if (!req.body.key) {
    message = "Vui lòng cung cấp key để thay đổi!";
  } else if (!["status", "delete"].includes(req.body.key)) {
    message = "Key không hợp lệ! Phải là 'status' hoặc 'delete'.";
  }

  if (
    req.body.key === "status" &&
    !["active", "inactive"].includes(req.body.value)
  ) {
    message = "Trạng thái không hợp lệ! Phải là 'active' hoặc 'inactive'.";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.create = (req, res, next) => {
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

  if (
    req.body.gender &&
    req.body.gender !== "Nam" &&
    req.body.gender !== "Nữ"
  ) {
    message = "Giới tính không hợp lệ! Phải là 'Nam' hoặc 'Nữ'.";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.edit = (req, res, next) => {
  let message = "";

  if (req.body.phone && !/^\d{10}$/.test(req.body.phone)) {
    message = "Số điện thoại không hợp lệ!";
  }

  if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    message = "Email không hợp lệ!";
  }

  if (
    req.body.gender &&
    req.body.gender !== "Nam" &&
    req.body.gender !== "Nữ"
  ) {
    message = "Giới tính không hợp lệ! Phải là 'Nam' hoặc 'Nữ'.";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.EditMyAccount = (req, res, next) => {
  let message = "";

  if (req.body.phone && !/^\d{10}$/.test(req.body.phone)) {
    message = "Số điện thoại không hợp lệ!";
  }

  if (
    req.body.gender &&
    req.body.gender !== "Nam" &&
    req.body.gender !== "Nữ"
  ) {
    message = "Giới tính không hợp lệ! Phải là 'Nam' hoặc 'Nữ'.";
  }

  if (req.body.birth) {
    const birthDate = new Date(req.body.birth);
    if (isNaN(birthDate.getTime())) {
      message = "Ngày sinh không hợp lệ!";
    }
  }

  if (req.body.password || req.body.confirmPassword) {
    if (!req.body.currentPassword) {
      message = "Vui lòng nhập mật khẩu cũ!";
    }

    if (!req.body.password) {
      message = "Vui lòng nhập mật khẩu mới!";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        req.body.password
      )
    ) {
      message =
        "Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 chữ số và 1 ký tự đặc biệt.";
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
