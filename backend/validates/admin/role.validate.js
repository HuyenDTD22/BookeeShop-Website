module.exports.index = (req, res, next) => {
  let message = "";

  if (req.query.status && !["active", "inactive"].includes(req.query.status)) {
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

module.exports.detail = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID nhóm quyền không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.changeStatus = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID nhóm quyền không hợp lệ!";
  }

  if (!req.body.status) {
    message = "Trạng thái là bắt buộc!";
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
    message = "Danh sách ID phải là mảng và không được rỗng!";
  }

  if (!req.body.ids.every((id) => /^[0-9a-fA-F]{24}$/.test(id))) {
    message = "Một hoặc nhiều ID không hợp lệ!";
  }

  if (!req.body.key) {
    message = "Khóa (key) là bắt buộc!";
  } else if (!["status", "delete"].includes(req.body.key)) {
    message = "Khóa không hợp lệ! Phải là 'status' hoặc 'delete'.";
  }

  if (req.body.key === "status" && !req.body.value) {
    message = "Giá trị trạng thái là bắt buộc!";
  } else if (
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

  if (!req.body.title || req.body.title.trim().length === 0) {
    message = "Tiêu đề là bắt buộc!";
  } else if (req.body.title.length > 100) {
    message = "Tiêu đề không được vượt quá 100 ký tự!";
  }

  if (req.body.description && req.body.description.length > 500) {
    message = "Mô tả không được vượt quá 500 ký tự!";
  }

  if (req.body.status && !["active", "inactive"].includes(req.body.status)) {
    message = "Trạng thái không hợp lệ! Phải là 'active' hoặc 'inactive'.";
  }

  if (req.body.permissions && !Array.isArray(req.body.permissions)) {
    message = "Quyền hạn phải là mảng!";
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

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID nhóm quyền không hợp lệ!";
  }

  if (req.body.title && req.body.title.trim().length === 0) {
    message = "Tiêu đề không được để trống!";
  } else if (req.body.title && req.body.title.length > 100) {
    message = "Tiêu đề không được vượt quá 100 ký tự!";
  }

  if (req.body.description && req.body.description.length > 500) {
    message = "Mô tả không được vượt quá 500 ký tự!";
  }

  if (req.body.status && !["active", "inactive"].includes(req.body.status)) {
    message = "Trạng thái không hợp lệ! Phải là 'active' hoặc 'inactive'.";
  }

  if (req.body.permissions && !Array.isArray(req.body.permissions)) {
    message = "Quyền hạn phải là mảng!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.permissions = (req, res, next) => {
  let message = "";

  if (
    !req.body.permissions ||
    !Array.isArray(req.body.permissions) ||
    req.body.permissions.length === 0
  ) {
    message = "Danh sách quyền hạn là bắt buộc và phải là mảng không rỗng!";
  }

  if (req.body.permissions) {
    for (const item of req.body.permissions) {
      if (!item.id || !/^[0-9a-fA-F]{24}$/.test(item.id)) {
        message = `ID ${item.id || ""} trong danh sách quyền hạn không hợp lệ!`;
      }
      if (!Array.isArray(item.permissions)) {
        message = `Quyền hạn cho ID ${item.id || ""} phải là mảng!`;
      }
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

module.exports.delete = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID nhóm quyền không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
