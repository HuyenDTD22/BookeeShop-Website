const mongoose = require("mongoose");
const Book = require("../../models/book.model");
const Comment = require("../../models/comment.model");
const Rating = require("../../models/rating.model");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /api/admin/comment/:bookId - Lấy ra tất cả bình luận của 1 cuốn sách
module.exports.index = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { search = "", ratingFilter } = req.query;

    const book = await Book.findOne({ _id: bookId, deleted: false });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy sách" });
    }

    // Điều kiện lọc
    const query = { book_id: bookId, deleted: false };
    if (search) {
      query.content = { $regex: search, $options: "i" };
    }
    if (ratingFilter) {
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

    const ratings = await Rating.find({
      book_id: bookId,
      deleted: false,
    });

    let commentList = await createTreeHelper.tree(comments);

    // Gán rating cho tất cả bình luận
    const assignRatingToTree = (comments) => {
      return comments.map((comment) => {
        let rating = null;
        if (comment.user_id && comment.user_id._id) {
          rating = ratings.find(
            (r) => r.user_id.toString() === comment.user_id._id.toString()
          );
        }
        const updatedComment = {
          ...comment,
          rating: rating ? rating.rating : null,
        };
        if (comment.children && comment.children.length > 0) {
          updatedComment.children = assignRatingToTree(comment.children);
        } else {
          updatedComment.children = comment.children || [];
        }
        return updatedComment;
      });
    };

    commentList = assignRatingToTree(commentList);
    commentList = JSON.parse(JSON.stringify(commentList));

    res.json({
      status: "success",
      data: {
        comments: commentList,
        total: commentList.length,
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
        .json({ status: "error", message: "Nội dung phản hồi là bắt buộc." });
    }

    if (!res.locals.user || !res.locals.user._id) {
      return res
        .status(401)
        .json({ status: "error", message: "Không tìm thấy người dùng." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment || comment.deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy bình luận." });
    }

    const replyComment = new Comment({
      user_id: res.locals.user._id,
      book_id: comment.book_id,
      content: replyContent,
      parent_id: commentId,
      isAdmin: true,
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

// [DELETE] /api/admin/comment/delete/:commentId - Xóa 1 bình luận
module.exports.delete = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment || comment.deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy bình luận." });
    }

    comment.deleted = true;
    comment.deletedBy = {
      account_id: req.user._id,
      deletedAt: new Date(),
    };
    await comment.save();

    res.json({
      status: "success",
      message: "Bình luận đã được xoá thành công.",
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
        message: "CommentIds là bắt buộc và phải là 1 mảng.",
      });
    }

    await Comment.updateMany(
      { _id: { $in: commentIds }, deleted: false },
      {
        $set: {
          deleted: true,
          deletedBy: {
            account_id: req.user._id,
            deletedAt: new Date(),
          },
        },
      }
    );

    res.json({
      status: "success",
      message: "các bình luận được chọn đã xoá thành công.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// [PATCH] /api/admin/comment/delete-all/:bookId - Xóa tất cả bình luận của một cuốn sách
module.exports.deleteAll = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findOne({ _id: bookId, deleted: false });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy sách." });
    }

    await Comment.updateMany(
      { book_id: bookId, deleted: false },
      {
        $set: {
          deleted: true,
          deletedBy: {
            account_id: req.user._id,
            deletedAt: new Date(),
          },
        },
      }
    );

    res.json({
      status: "success",
      message: "Tất cả bình luận của quyển sách này đã được xoá thành công.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
