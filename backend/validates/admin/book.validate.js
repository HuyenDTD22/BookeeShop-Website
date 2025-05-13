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
    message = "Vui lòng nhập tiêu đề sách!";
  }

  if (!req.body.price) {
    message = "Vui lòng nhập giá sách!";
  } else if (isNaN(req.body.price) || parseInt(req.body.price) <= 0) {
    message = "Giá sách phải là số nguyên dương!";
  }

  if (!req.body.discountPercentage) {
    message = "Vui lòng nhập phần trăm giảm giá!";
  } else if (
    isNaN(req.body.discountPercentage) ||
    parseInt(req.body.discountPercentage) < 0 ||
    parseInt(req.body.discountPercentage) > 100
  ) {
    message = "Phần trăm giảm giá phải là số từ 0 đến 100!";
  }

  if (!req.body.stock) {
    message = "Vui lòng nhập số lượng tồn kho!";
  } else if (isNaN(req.body.stock) || parseInt(req.body.stock) < 0) {
    message = "Số lượng tồn kho phải là số nguyên không âm!";
  }

  if (!req.body.author) {
    message = "Vui lòng nhập tác giả!";
  }

  if (!req.body.supplier) {
    message = "Vui lòng nhập nhà cung cấp!";
  }

  if (!req.body.publisher) {
    message = "Vui lòng nhập nhà xuất bản!";
  }

  if (!req.body.publish_year) {
    message = "Vui lòng nhập năm xuất bản!";
  } else if (
    !/^\d{4}$/.test(req.body.publish_year) ||
    parseInt(req.body.publish_year) > new Date().getFullYear()
  ) {
    message = "Năm xuất bản không hợp lệ!";
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

  if (
    req.body.discountPercentage &&
    (isNaN(req.body.discountPercentage) ||
      parseInt(req.body.discountPercentage) < 0 ||
      parseInt(req.body.discountPercentage) > 100)
  ) {
    message = "Phần trăm giảm giá phải là số từ 0 đến 100!";
  }

  if (
    req.body.stock &&
    (isNaN(req.body.stock) || parseInt(req.body.stock) < 0)
  ) {
    message = "Số lượng tồn kho phải là số nguyên không âm!";
  }

  if (
    req.body.publish_year &&
    (!/^\d{4}$/.test(req.body.publish_year) ||
      parseInt(req.body.publish_year) > new Date().getFullYear())
  ) {
    message = "Năm xuất bản không hợp lệ!";
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
