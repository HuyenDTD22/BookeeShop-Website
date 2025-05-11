const mongoose = require("mongoose");
const Book = require("../../models/book.model");
const Comment = require("../../models/comment.model");
const Rating = require("../../models/rating.model");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /api/admin/comment/:bookId - Lấy ra tất cả các bình luận của một cuốn sách
module.exports.index = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { search = "", ratingFilter } = req.query;

    // Kiểm tra sách có tồn tại và chưa bị xóa
    const book = await Book.findOne({ _id: bookId, deleted: false });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    // Điều kiện lọc
    const query = { book_id: bookId, deleted: false };
    if (search) {
      query.content = { $regex: search, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }
    if (ratingFilter) {
      // Lọc theo số sao (cần liên kết với Rating)
      const ratings = await Rating.find({
        book_id: bookId,
        user_id: {
          $in: await Comment.distinct("user_id", { book_id: bookId }),
        },
      });
      const filteredUserIds = ratings
        .filter((r) => r.rating === parseInt(ratingFilter))
        .map((r) => r.user_id);
      query.user_id = { $in: filteredUserIds };
    }

    // Lấy danh sách bình luận
    let comments = await Comment.find(query)
      .populate("user_id", "email fullName")
      .populate("book_id", "title");

    // Lấy tất cả rating liên quan đến cuốn sách này
    const ratings = await Rating.find({
      book_id: bookId,
      deleted: false,
    });

    // Chuẩn hóa dữ liệu trả về (bao gồm cây bình luận nếu cần)
    let commentList = await createTreeHelper.tree(comments);

    // Hàm đệ quy để gán rating cho tất cả bình luận, bao gồm cả bình luận con
    const assignRatingToTree = (comments) => {
      return comments.map((comment) => {
        const rating = ratings.find(
          (r) => r.user_id.toString() === comment.user_id._id.toString()
        );
        const updatedComment = {
          ...comment,
          rating: rating ? rating.rating : null, // Gán rating cho bình luận hiện tại
        };
        if (comment.children && comment.children.length > 0) {
          updatedComment.children = assignRatingToTree(comment.children); // Gán rating cho bình luận con
        }
        return updatedComment;
      });
    };

    // Gán rating cho toàn bộ cây bình luận
    commentList = assignRatingToTree(commentList);

    // Chuyển đổi toàn bộ commentList thành plain object (để đảm bảo dữ liệu trả về là object)
    commentList = JSON.parse(JSON.stringify(commentList));

    res.json({
      status: "success",
      data: {
        comments: commentList,
        total: commentList.length, // Thêm total để hỗ trợ phân trang phía client
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// [POST] /api/admin/comment/reply/:commentId - Phản hồi bình luận của khách hàng
module.exports.reply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { replyContent } = req.body;

    if (!replyContent) {
      return res
        .status(400)
        .json({ status: "error", message: "Reply content is required" });
    }

    // Tìm bình luận gốc
    const comment = await Comment.findById(commentId);
    if (!comment || comment.deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found" });
    }

    // Thêm phản hồi bằng cách tạo bình luận mới với parent_id
    const replyComment = new Comment({
      user_id: req.user._id, // Giả định req.user chứa thông tin admin
      book_id: comment.book_id,
      content: replyContent,
      parent_id: commentId,
      isAdmin: true, // Đánh dấu phản hồi từ admin
    });
    await replyComment.save();

    res.json({
      status: "success",
      data: {
        commentId: replyComment._id,
        reply: replyContent,
        repliedAt: replyComment.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// [DELETE] /api/admin/comment/delete/:commentId - Xóa 1 bình luận cụ thể
module.exports.delete = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Xóa mềm bình luận
    const comment = await Comment.findById(commentId);
    if (!comment || comment.deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found" });
    }

    comment.deleted = true;
    comment.deletedBy = {
      account_id: req.user._id, // Giả định req.user chứa thông tin admin
      deletedAt: new Date(),
    };
    await comment.save();

    res.json({
      status: "success",
      message: "Comment has been soft-deleted.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// [PATCH] /api/admin/comment/delete-multi - Xóa nhiều bình luận
module.exports.deleteMulti = async (req, res) => {
  try {
    const { commentIds } = req.body;

    if (!Array.isArray(commentIds) || commentIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Comment IDs are required and must be an array",
      });
    }

    // Xóa mềm nhiều bình luận
    await Comment.updateMany(
      { _id: { $in: commentIds }, deleted: false },
      {
        $set: {
          deleted: true,
          deletedBy: {
            account_id: req.user._id, // Giả định req.user chứa thông tin admin
            deletedAt: new Date(),
          },
        },
      }
    );

    res.json({
      status: "success",
      message: "Selected comments have been soft-deleted.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// [PATCH] /api/admin/comment/delete-all/:bookId - Xóa mềm tất cả bình luận của một cuốn sách
module.exports.deleteAll = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Kiểm tra sách có tồn tại và chưa bị xóa
    const book = await Book.findOne({ _id: bookId, deleted: false });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    // Xóa mềm tất cả bình luận của sách
    await Comment.updateMany(
      { book_id: bookId, deleted: false },
      {
        $set: {
          deleted: true,
          deletedBy: {
            account_id: req.user._id, // Giả định req.user chứa thông tin admin
            deletedAt: new Date(),
          },
        },
      }
    );

    res.json({
      status: "success",
      message: "All comments for this book have been soft-deleted.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
