module.exports.add = (req, res, next) => {
  let message = "";

  if (!req.params.slug || req.params.slug.trim().length === 0) {
    message = "Slug sách là bắt buộc!";
  }

  const quantity = parseInt(req.body.quantity) || 1;
  if (isNaN(quantity) || quantity <= 0) {
    message = "Số lượng phải là số dương!";
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

  if (!req.params.bookId || !/^[0-9a-fA-F]{24}$/.test(req.params.bookId)) {
    message = "ID sách không hợp lệ!";
  }

  const quantity = parseInt(req.body.quantity);
  if (isNaN(quantity) || quantity <= 0) {
    message = "Số lượng phải là số dương!";
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

  if (!req.params.bookId || !/^[0-9a-fA-F]{24}$/.test(req.params.bookId)) {
    message = "ID sách không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
