module.exports.index = (req, res, next) => {
  let message = "";

  if (req.query.startDate && isNaN(new Date(req.query.startDate).getTime())) {
    message = "Ngày bắt đầu không hợp lệ!";
  }

  if (req.query.endDate && isNaN(new Date(req.query.endDate).getTime())) {
    message = "Ngày kết thúc không hợp lệ!";
  }

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    if (startDate > endDate) {
      message = "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc!";
    }
  }

  if (message.length > 0) {
    return res.json({
      success: false,
      message: message,
    });
  }

  next();
};

module.exports.detail = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID đơn hàng không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      success: false,
      message: message,
    });
  }

  next();
};

module.exports.changeStatus = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID đơn hàng không hợp lệ!";
  }

  if (!req.body.status) {
    message = "Trạng thái là bắt buộc!";
  } else if (
    !["pending", "delivered", "completed", "cancelled"].includes(
      req.body.status
    )
  ) {
    message =
      "Trạng thái không hợp lệ! Phải là 'pending', 'delivered', 'completed' hoặc 'cancelled'.";
  }

  if (message.length > 0) {
    return res.json({
      success: false,
      message: message,
    });
  }

  next();
};

module.exports.changeMulti = (req, res, next) => {
  let message = "";

  if (
    !req.body.orderIds ||
    !Array.isArray(req.body.orderIds) ||
    req.body.orderIds.length === 0
  ) {
    message = "Danh sách orderIds phải là mảng và không được rỗng!";
  }

  if (!req.body.orderIds.every((id) => /^[0-9a-fA-F]{24}$/.test(id))) {
    message = "Một hoặc nhiều ID đơn hàng không hợp lệ!";
  }

  if (!req.body.status) {
    message = "Trạng thái là bắt buộc!";
  } else if (
    !["pending", "delivered", "completed", "cancelled"].includes(
      req.body.status
    )
  ) {
    message =
      "Trạng thái không hợp lệ! Phải là 'pending', 'delivered', 'completed' hoặc 'cancelled'.";
  }

  if (message.length > 0) {
    return res.json({
      success: false,
      message: message,
    });
  }

  next();
};

module.exports.delete = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID đơn hàng không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      success: false,
      message: message,
    });
  }

  next();
};
