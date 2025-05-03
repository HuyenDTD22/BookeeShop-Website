const mongoose = require("mongoose");
const Book = require("../../models/book.model");
const Comment = require("../../models/comment.model");

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
      parentCommentId: null,
      status: "active",
      deleted: false,
    })
      .populate("user_id", "name email")
      .populate("book_id", "title")
      .sort({ createdAt: -1 });

    // Lấy tổng số bình luận gốc
    const total = await Comment.countDocuments({
      book_id: bookId,
      parentCommentId: null,
      status: "active",
      deleted: false,
    });

    // Lấy danh sách bình luận con (nếu có)
    const commentIds = comments.map((comment) => comment._id);
    const replies = await Comment.find({
      parentCommentId: { $in: commentIds },
      status: "active",
      deleted: false,
    })
      .populate("user_id", "name email")
      .sort({ createdAt: 1 });

    // // Gộp bình luận con vào bình luận gốc
    // const commentsWithReplies = comments.map((comment) => {
    //   const commentReplies = replies.filter(
    //     (reply) => reply.parentCommentId.toString() === comment._id.toString()
    //   );
    //   return { ...comment._doc, replies: commentReplies };
    // });

    // Gộp bình luận con vào bình luận gốc và thêm trường canDelete
    const commentsWithReplies = comments.map((comment) => {
      const commentReplies = replies.filter(
        (reply) => reply.parentCommentId.toString() === comment._id.toString()
      );
      const commentData = {
        ...comment._doc,
        replies: commentReplies.map((reply) => ({
          ...reply._doc,
          canDelete:
            user && reply.user_id?._id.toString() === user._id.toString(),
        })),
        canDelete:
          user && comment.user_id?._id.toString() === user._id.toString(),
      };
      return commentData;
    });

    res.json({
      code: 200,
      comments: commentsWithReplies,
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
    const { book_id, content, thumbnail, parentCommentId } = req.body;
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
      book_id,
      user_id,
      content,
      thumbnail: thumbnail || null,
      parentCommentId: parentCommentId || null,
      status: "active",
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
