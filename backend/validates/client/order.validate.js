const mongoose = require("mongoose");

module.exports.create = (req, res, next) => {
  let message = "";

  if (
    !req.body.items ||
    !Array.isArray(req.body.items) ||
    req.body.items.length === 0
  ) {
    message = "Danh sách items là bắt buộc và phải là mảng không rỗng!";
  } else {
    for (const item of req.body.items) {
      if (!item.book_id || !mongoose.Types.ObjectId.isValid(item.book_id)) {
        message = `book_id ${item.book_id} không hợp lệ!`;
        break;
      }
      if (!item.quantity || item.quantity <= 0) {
        message = `Số lượng cho book_id ${item.book_id} phải lớn hơn 0!`;
        break;
      }
    }
  }

  if (!req.body.fullName || req.body.fullName.trim().length === 0) {
    message = "Họ tên là bắt buộc!";
  } else if (req.body.fullName.length > 100) {
    message = "Họ tên không được vượt quá 100 ký tự!";
  }

  if (!req.body.phone || !/^\d{10}$/.test(req.body.phone)) {
    message = "Số điện thoại không hợp lệ!";
  }

  if (!req.body.address || req.body.address.trim().length === 0) {
    message = "Địa chỉ là bắt buộc!";
  } else if (req.body.address.length > 500) {
    message = "Địa chỉ không được vượt quá 500 ký tự!";
  }

  if (
    !req.body.paymentMethod ||
    !["cod", "bank_transfer", "momo"].includes(req.body.paymentMethod)
  ) {
    message =
      "Phương thức thanh toán không hợp lệ! Phải là 'cod', 'bank_transfer' hoặc 'momo'.";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.success = (req, res, next) => {
  let message = "";

  if (
    !req.params.orderId ||
    !mongoose.Types.ObjectId.isValid(req.params.orderId)
  ) {
    message = "orderId không hợp lệ!";
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

  if (
    !req.params.orderId ||
    !mongoose.Types.ObjectId.isValid(req.params.orderId)
  ) {
    message = "orderId không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.cancel = (req, res, next) => {
  let message = "";

  if (
    !req.params.orderId ||
    !mongoose.Types.ObjectId.isValid(req.params.orderId)
  ) {
    message = "orderId không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
