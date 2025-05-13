const mongoose = require("mongoose");
const Book = require("../../models/book.model");
const Comment = require("../../models/comment.model");
const Order = require("../../models/order.model");

const createTreeHelper = require("../../helpers/createTree");

//[GET] /comment/:bookId - Hiển thị bình luận của 1 cuốn sách
module.exports.index = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const user = req.user || null;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy cuốn sách",
      });
    }

    const comments = await Comment.find({
      book_id: bookId,
      deleted: false,
    })
      .populate("user_id", "name fullName avatar")
      .populate("book_id", "title")
      .sort({ createdAt: -1 });

    const newComments = createTreeHelper.tree(comments);

    const total = comments.length;

    res.json({
      code: 200,
      comments: newComments,
      total: total,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [POST] /comment/create
module.exports.create = async (req, res) => {
  try {
    const { book_id, content, parentCommentId } = req.body;
    const user_id = req.user._id;

    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy cuốn sách",
      });
    }

    const purchasedOrder = await Order.findOne({
      user_id: user_id,
      "books.book_id": book_id,
      status: "completed",
      deleted: false,
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        code: 403,
        message:
          "Bạn cần mua và hoàn thành đơn hàng chứa sách này để được bình luận",
      });
    }

    if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
      return res.status(400).json({
        code: 400,
        message: "parentCommentId không hợp lệ",
      });
    }

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          code: 404,
          message: "Không tìm thấy bình luận cha",
        });
      }
    }

    const newComment = new Comment({
      user_id,
      ...req.body,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id)
      .populate("user_id", "name email")
      .populate("book_id", "title");

    res.json({
      code: 200,
      message: "Tạo bình luận thành công!",
      comment: populatedComment,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

//[DELETE] /comment/delete/:commentId
module.exports.delete = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const user_id = req.user._id;
    const bookId = req.query.bookId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bình luận",
      });
    }

    if (comment.user_id.toString() !== user_id.toString()) {
      res.json({
        code: 400,
        message: "Bạn không có quyền xóa bình luận này",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy cuốn sách",
      });
    }

    const purchasedOrder = await Order.findOne({
      user_id: user_id,
      "books.book_id": bookId,
      status: "completed",
      deleted: false,
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        code: 403,
        message:
          "Bạn cần mua và hoàn thành đơn hàng chứa sách này để được xóa bình luận",
      });
    }

    if (comment.status !== "active" || comment.deleted) {
      return res.status(400).json({
        code: 400,
        message: "Bình luận không thể xóa",
      });
    }

    await Comment.updateOne(
      { _id: comment._id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    res.json({
      code: 200,
      message: "Xóa bình luận thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};
