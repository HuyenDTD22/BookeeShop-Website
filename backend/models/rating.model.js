const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 5,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo chỉ có một đánh giá duy nhất từ một người dùng cho một cuốn sách
ratingSchema.index({ book_id: 1, user_id: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema, "rating");

module.exports = Rating;
