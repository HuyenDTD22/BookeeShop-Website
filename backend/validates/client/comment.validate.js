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
    return res.json({
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

  if (!req.body.content || req.body.content.trim().length === 0) {
    message = "Nội dung bình luận là bắt buộc!";
  } else if (req.body.content.length > 1000) {
    message = "Nội dung bình luận không được vượt quá 1000 ký tự!";
  }

  if (
    req.body.parentCommentId &&
    !mongoose.Types.ObjectId.isValid(req.body.parentCommentId)
  ) {
    message = "parentCommentId không hợp lệ!";
  }

  if (req.body.thumbnail && req.body.thumbnail.length > 255) {
    message = "Đường dẫn thumbnail không được vượt quá 255 ký tự!";
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

  if (
    !req.params.commentId ||
    !mongoose.Types.ObjectId.isValid(req.params.commentId)
  ) {
    message = "commentId không hợp lệ!";
  }

  if (!req.query.bookId || !mongoose.Types.ObjectId.isValid(req.query.bookId)) {
    message = "bookId không hợp lệ!";
  }

  if (message.length > 0) {
    return res.json({
      code: 400,
      message: message,
    });
  }

  next();
};
