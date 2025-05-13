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

  if (!req.body.title) {
    message = "Vui lòng nhập tiêu đề!";
  }

  if (req.body.status && !["active", "inactive"].includes(req.body.status)) {
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

module.exports.edit = (req, res, next) => {
  let message = "";

  if (req.body.title && req.body.title.trim() === "") {
    message = "Tiêu đề không được để trống!";
  }

  if (req.body.status && !["active", "inactive"].includes(req.body.status)) {
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
