const mongoose = require("mongoose");
const Rating = require("../models/rating.model");
const Book = require("../models/book.model");

module.exports.updateBookRatingMean = async (bookId) => {
  try {
    // Lấy tất cả đánh giá hợp lệ của sách
    const ratings = await Rating.find({
      book_id: bookId,
      deleted: false,
    });

    // Tính trung bình đánh giá
    let ratingMean = 5; // Giá trị mặc định khi không có đánh giá
    if (ratings.length > 0) {
      const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
      ratingMean = totalRating / ratings.length;
    }

    // Làm tròn đến 1 chữ số thập phân
    ratingMean = Number(ratingMean.toFixed(1));

    // Cập nhật rating_mean trong sách
    const updatedBook = await Book.updateOne(
      { _id: bookId },
      { $set: { rating_mean: ratingMean } },
    );

    return ratingMean;
  } catch (error) {
    console.error("Error updating rating_mean:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};
