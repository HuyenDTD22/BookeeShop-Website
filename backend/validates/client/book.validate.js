module.exports.category = (req, res, next) => {
  let message = "";

  if (!req.params.slugCategory || req.params.slugCategory.trim().length === 0) {
    message = "Slug danh mục là bắt buộc!";
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

  if (!req.params.slugBook || req.params.slugBook.trim().length === 0) {
    message = "Slug sách là bắt buộc!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
