const mongoose = require("mongoose");
const Rating = require("../../models/rating.model");
const Book = require("../../models/book.model");

// [GET] /api/admin/rating/:bookId
module.exports.index = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Kiểm tra sách có tồn tại và chưa bị xóa
    const book = await Book.findOne({ _id: bookId, deleted: false });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    // Lấy danh sách đánh giá sao (không lấy các đánh giá đã bị xóa)
    const ratings = await Rating.find({ book_id: bookId, deleted: false })
      .populate("user_id", "email fullName")
      .populate("book_id", "title")
      .populate("order_id", "orderNumber");

    // Chuẩn hóa dữ liệu trả về
    const ratingList = ratings.map((rating) => ({
      id: rating._id,
      user: rating.user_id
        ? {
            id: rating.user_id._id,
            email: rating.user_id.email,
            fullName: rating.user_id.fullName,
          }
        : null,
      book: rating.book_id
        ? { id: rating.book_id._id, title: rating.book_id.title }
        : null,
      order: rating.order_id
        ? { id: rating.order_id._id, orderNumber: rating.order_id.orderNumber }
        : null,
      rating: rating.rating,
      createdAt: rating.createdAt,
    }));

    res.json({
      status: "success",
      data: {
        ratings: ratingList,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// [PATCH] /api/admin/rating/delete-all/:bookId - Xóa mềm tất cả đánh giá của một cuốn sách
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

    // Xóa mềm tất cả đánh giá của sách
    await Rating.updateMany(
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
      message: "All ratings for this book have been soft-deleted.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
