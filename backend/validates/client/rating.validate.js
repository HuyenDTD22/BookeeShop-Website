const mongoose = require("mongoose");

module.exports.index = (req, res, next) => {
  let message = "";

  if (
    !req.params.bookId ||
    !mongoose.Types.ObjectId.isValid(req.params.bookId)
  ) {
    message = "bookId không hợp lệ!";
  }

  if (message.length > 0) {
    return res.status(400).json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.create = (req, res, next) => {
  let message = "";

  if (!req.body.book_id || !mongoose.Types.ObjectId.isValid(req.body.book_id)) {
    message = "book_id không hợp lệ!";
  }

  if (!req.body.rating || req.body.rating < 1 || req.body.rating > 5) {
    message = "Rating phải là số từ 1 đến 5!";
  }

  if (
    req.body.order_id &&
    !mongoose.Types.ObjectId.isValid(req.body.order_id)
  ) {
    message = "order_id không hợp lệ!";
  }

  if (message.length > 0) {
    return res.status(400).json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.update = (req, res, next) => {
  let message = "";

  if (
    !req.params.ratingId ||
    !mongoose.Types.ObjectId.isValid(req.params.ratingId)
  ) {
    message = "ratingId không hợp lệ!";
  }

  if (!req.body.rating || req.body.rating < 1 || req.body.rating > 5) {
    message = "Rating phải là số từ 1 đến 5!";
  }

  if (message.length > 0) {
    return res.status(400).json({
      code: 400,
      message: message,
    });
  }

  next();
};

module.exports.delete = (req, res, next) => {
  let message = "";

  if (
    !req.params.ratingId ||
    !mongoose.Types.ObjectId.isValid(req.params.ratingId)
  ) {
    message = "ratingId không hợp lệ!";
  }

  if (message.length > 0) {
    return res.status(400).json({
      code: 400,
      message: message,
    });
  }

  next();
};
