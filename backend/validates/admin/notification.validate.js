module.exports.index = (req, res, next) => {
  // Endpoint GET / không cần dữ liệu đầu vào từ body
  // Không cần validate, chỉ gọi next()
  next();
};

module.exports.detail = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID thông báo không hợp lệ!";
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

  if (
    !req.body.title ||
    req.body.title.trim().length === 0 ||
    req.body.title.length > 200
  ) {
    message = "Tiêu đề là bắt buộc và không được vượt quá 200 ký tự!";
  }

  if (!req.body.content || req.body.content.trim().length === 0) {
    message = "Nội dung là bắt buộc!";
  }

  if (
    !req.body.type ||
    !["system", "promotion", "personal"].includes(req.body.type)
  ) {
    message = "Loại thông báo không hợp lệ!";
  }

  if (
    !req.body.target ||
    !["all", "group", "specific"].includes(req.body.target.type)
  ) {
    message = "Đối tượng không hợp lệ!";
  }

  if (req.body.sendAt && new Date(req.body.sendAt) <= new Date()) {
    message = "Thời gian gửi phải trong tương lai!";
  }

  if (
    req.body.target.type === "specific" &&
    (!req.body.target.userIds || req.body.target.userIds.length === 0)
  ) {
    message = "Danh sách userIds là bắt buộc khi target là specific!";
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
    message = "ID thông báo không hợp lệ!";
  }

  if (
    !req.body.title ||
    req.body.title.trim().length === 0 ||
    req.body.title.length > 200
  ) {
    message = "Tiêu đề là bắt buộc và không được vượt quá 200 ký tự!";
  }

  if (!req.body.content || req.body.content.trim().length === 0) {
    message = "Nội dung là bắt buộc!";
  }

  if (
    !req.body.type ||
    !["system", "promotion", "personal"].includes(req.body.type)
  ) {
    message = "Loại thông báo không hợp lệ!";
  }

  if (
    !req.body.target ||
    !["all", "group", "specific"].includes(req.body.target.type)
  ) {
    message = "Đối tượng không hợp lệ!";
  }

  if (req.body.sendAt && new Date(req.body.sendAt) <= new Date()) {
    message = "Thời gian gửi phải trong tương lai!";
  }

  if (
    req.body.target.type === "specific" &&
    (!req.body.target.userIds || req.body.target.userIds.length === 0)
  ) {
    message = "Danh sách userIds là bắt buộc khi target là specific!";
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
    message = "ID thông báo không hợp lệ!";
  }

  if (
    !req.body.status ||
    !["draft", "sent", "scheduled", "canceled"].includes(req.body.status)
  ) {
    message =
      "Trạng thái không hợp lệ! Phải là 'draft', 'sent', 'scheduled' hoặc 'canceled'.";
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

  if (
    !req.body.status ||
    !["draft", "sent", "scheduled", "canceled"].includes(req.body.status)
  ) {
    message =
      "Trạng thái không hợp lệ! Phải là 'draft', 'sent', 'scheduled' hoặc 'canceled'.";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.send = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID thông báo không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.schedule = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID thông báo không hợp lệ!";
  }

  if (!req.body.sendAt) {
    message = "Thời gian gửi là bắt buộc!";
  } else if (new Date(req.body.sendAt) <= new Date()) {
    message = "Thời gian gửi phải trong tương lai!";
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
    message = "ID thông báo không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.deleteMulti = (req, res, next) => {
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

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.read = (req, res, next) => {
  let message = "";

  if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    message = "ID thông báo không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.stats = (req, res, next) => {
  // Endpoint GET /stats không cần dữ liệu đầu vào từ body
  // Không cần validate, chỉ gọi next()
  next();
};
