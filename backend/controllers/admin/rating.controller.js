const mongoose = require("mongoose");
const Rating = require("../../models/rating.model");
const Book = require("../../models/book.model");

// [GET] /api/admin/rating/:bookId - Lấy ra tất cả đánh giá sao của 1 sách
module.exports.index = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findOne({ _id: bookId, deleted: false });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy sách." });
    }

    const ratings = await Rating.find({ book_id: bookId, deleted: false })
      .populate("user_id", "email fullName")
      .populate("book_id", "title")
      .populate("order_id", "orderNumber");

    res.json({
      status: "success",
      data: {
        ratings: ratings,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// [PATCH] /api/admin/rating/delete-all/:bookId - Xóa tất cả đánh giá của một cuốn sách
module.exports.deleteAll = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findOne({ _id: bookId, deleted: false });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    await Rating.updateMany(
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
      message: "Tất cả đánh giá sao của quyển sách này đã được xoá.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
