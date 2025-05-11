const mongoose = require("mongoose");
const Book = require("../../models/book.model");
const Comment = require("../../models/comment.model");
const Order = require("../../models/order.model");

const createTreeHelper = require("../../helpers/createTree");

//[GET] /comment/:bookId - Hiển thị bình luận của 1 cuốn sách
module.exports.index = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const user = req.user || null; // req.user được thêm bởi middleware xác thực JWT

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy cuốn sách",
      });
    }

    // Lấy danh sách bình luận gốc (parentCommentId = null)
    const comments = await Comment.find({
      book_id: bookId,
      deleted: false,
    })
      .populate("user_id", "name fullName avatar")
      .populate("book_id", "title")
      .sort({ createdAt: -1 });

    const newComments = createTreeHelper.tree(comments);

    // Lấy tổng số bình luận gốc
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

    // Kiểm tra dữ liệu đầu vào
    if (!book_id || !content) {
      return res.status(400).json({
        code: 400,
        message: "book_id và content là bắt buộc",
      });
    }

    // Kiểm tra book_id hợp lệ và tồn tại
    if (!mongoose.Types.ObjectId.isValid(book_id)) {
      return res.status(400).json({
        code: 400,
        message: "book_id không hợp lệ",
      });
    }

    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy cuốn sách",
      });
    }

    // Kiểm tra người dùng đã mua sách này chưa
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

    // Kiểm tra parentCommentId (nếu có)
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

    // Populate thông tin người dùng và sách
    const populatedComment = await Comment.findById(newComment._id)
      .populate("user_id", "name email") // Lấy tên và email của người dùng
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

    // Kiểm tra user_id (người dùng phải đăng nhập)
    if (!user_id) {
      return res.status(401).json({
        code: 401,
        message: "Vui lòng đăng nhập để xóa bình luận!",
      });
    }

    // Kiểm tra commentId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        code: 400,
        message: "commentId không hợp lệ",
      });
    }

    // Tìm bình luận
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bình luận",
      });
    }

    // Kiểm tra quyền xóa (chỉ người tạo bình luận mới được xóa)
    if (comment.user_id.toString() !== user_id.toString()) {
      res.json({
        code: 400,
        message: "Bạn không có quyền xóa bình luận này",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        code: 400,
        message: "bookId không hợp lệ",
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

    // Kiểm tra trạng thái bình luận
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
