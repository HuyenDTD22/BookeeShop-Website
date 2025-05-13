const mongoose = require("mongoose");

module.exports.detail = (req, res, next) => {
  let message = "";

  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    message = "ID thông báo không hợp lệ!";
  }

  if (message.length > 0) {
    return res.status(400).json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.read = (req, res, next) => {
  let message = "";

  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    message = "ID thông báo không hợp lệ!";
  }

  if (message.length > 0) {
    return res.status(400).json({
      code: 400,
      message: message,
    });
  }

  next();
};
