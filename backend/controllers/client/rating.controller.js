const mongoose = require("mongoose");
const Rating = require("../../models/rating.model");
const Book = require("../../models/book.model");
const Order = require("../../models/order.model");

const ratingHelper = require("../../helpers/rating");

// [GET] /rating/user-ratings - Lấy danh sách đánh giá sao của người dùng
module.exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user._id;

    const ratings = await Rating.find({
      user_id: userId,
      deleted: false,
    })
      .populate("book_id", "title thumbnail slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách đánh giá của người dùng thành công!",
      ratings,
    });
  } catch (error) {
    console.error("Error in getUserRatings:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi khi lấy danh sách đánh giá",
    });
  }
};

// [POST] /rating/create - Tạo đánh giá sao
module.exports.create = async (req, res) => {
  try {
    const { book_id, rating, order_id } = req.body;
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
          "Bạn cần mua và hoàn thành đơn hàng chứa sách này để được đánh giá",
      });
    }

    const existingRating = await Rating.findOne({
      book_id,
      user_id,
      deleted: false,
    });

    if (existingRating) {
      return res.status(400).json({
        code: 400,
        message: "Bạn đã đánh giá cuốn sách này rồi",
      });
    }

    const finalOrderId =
      order_id && mongoose.Types.ObjectId.isValid(order_id)
        ? order_id
        : purchasedOrder._id;

    const newRating = new Rating({
      book_id,
      user_id,
      rating,
      order_id: finalOrderId,
    });

    await newRating.save();

    const updatedRatingMean = await ratingHelper.updateBookRatingMean(book_id);

    const populatedRating = await Rating.findById(newRating._id)
      .populate("user_id", "fullName email")
      .populate("book_id", "title");

    res.status(200).json({
      code: 200,
      message: "Đánh giá thành công!",
      rating: populatedRating,
    });
  } catch (error) {
    console.error("Error in create rating:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /rating/:bookId - Lấy ra tất cả đánh giá sao của 1 quyển sách
module.exports.index = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy cuốn sách",
      });
    }

    const ratings = await Rating.find({
      book_id: bookId,
      deleted: false,
    })
      .populate("user_id", "fullName email")
      .populate("book_id", "title");

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
        : 5; // Mặc định 5 nếu không có đánh giá

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách đánh giá thành công!",
      ratings,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("Error in get ratings:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /rating/update/:ratingId - Sửa đánh giá
module.exports.update = async (req, res) => {
  try {
    const ratingId = req.params.ratingId;
    const { rating } = req.body;
    const user_id = req.user._id;

    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đánh giá",
      });
    }

    if (existingRating.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
      });
    }

    const purchasedOrder = await Order.findOne({
      user_id: user_id,
      "books.book_id": existingRating.book_id,
      status: "completed",
      deleted: false,
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        code: 403,
        message:
          "Bạn cần mua và hoàn thành đơn hàng chứa sách này để được chỉnh sửa đánh giá",
      });
    }

    // Cập nhật đánh giá
    existingRating.rating = rating;
    await existingRating.save();

    const updatedRatingMean = await ratingHelper.updateBookRatingMean(
      existingRating.book_id
    );

    const populatedRating = await Rating.findById(ratingId)
      .populate("user_id", "fullName email")
      .populate("book_id", "title");

    res.status(200).json({
      code: 200,
      message: "Cập nhật đánh giá thành công!",
      rating: populatedRating,
    });
  } catch (error) {
    console.error("Error in update rating:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [DELETE] /rating/delete/:ratingId - Xoá đánh giá
module.exports.delete = async (req, res) => {
  try {
    const ratingId = req.params.ratingId;
    const user_id = req.user._id;

    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đánh giá",
      });
    }

    if (existingRating.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa đánh giá này",
      });
    }

    existingRating.deleted = true;
    await existingRating.save();

    const updatedRatingMean = await ratingHelper.updateBookRatingMean(
      existingRating.book_id
    );

    res.status(200).json({
      code: 200,
      message: "Xóa đánh giá thành công!",
    });
  } catch (error) {
    console.error("Error in delete rating:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};
