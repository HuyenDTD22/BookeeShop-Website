const mongoose = require("mongoose");
const Rating = require("../../models/rating.model");
const Book = require("../../models/book.model");
const Order = require("../../models/order.model");

const ratingHelper = require("../../helpers/rating");

// [POST] /rating/create
module.exports.create = async (req, res) => {
  try {
    const { book_id, rating, order_id } = req.body;
    const user_id = req.user._id;

    // Kiểm tra dữ liệu đầu vào
    if (!book_id || !rating) {
      return res.status(400).json({
        code: 400,
        message: "book_id và rating là bắt buộc",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        code: 400,
        message: "Rating phải từ 1 đến 5",
      });
    }

    // Kiểm tra book_id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(book_id)) {
      return res.status(400).json({
        code: 400,
        message: "book_id không hợp lệ",
      });
    }

    // Kiểm tra sách tồn tại
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
          "Bạn cần mua và hoàn thành đơn hàng chứa sách này để được đánh giá",
      });
    }

    // Kiểm tra order_id nếu có
    if (order_id && !mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(400).json({
        code: 400,
        message: "order_id không hợp lệ",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá cuốn sách này chưa
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

    // Gán order_id hợp lệ
    const finalOrderId =
      order_id && mongoose.Types.ObjectId.isValid(order_id)
        ? order_id
        : purchasedOrder._id;

    // Tạo đánh giá mới
    const newRating = new Rating({
      book_id,
      user_id,
      rating,
      order_id: finalOrderId,
      status: "active",
    });

    await newRating.save();

    await ratingHelper.updateBookRatingMean(book_id);

    // Populate thông tin người dùng và sách
    const populatedRating = await Rating.findById(newRating._id)
      .populate("user_id", "fullName email")
      .populate("book_id", "title");

    res.status(200).json({
      code: 200,
      message: "Đánh giá thành công!",
      rating: populatedRating,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /rating/:bookId
module.exports.index = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // Kiểm tra bookId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        code: 400,
        message: "bookId không hợp lệ",
      });
    }

    // Kiểm tra sách tồn tại
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy cuốn sách",
      });
    }

    // Lấy danh sách đánh giá
    const ratings = await Rating.find({
      book_id: bookId,
      status: "active",
      deleted: false,
    })
      .populate("user_id", "fullName email")
      .populate("book_id", "title");

    // Tính trung bình rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
        : 0;

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách đánh giá thành công!",
      ratings,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /rating/update/:ratingId
module.exports.update = async (req, res) => {
  try {
    const ratingId = req.params.ratingId;
    const { rating } = req.body;
    const user_id = req.user._id;

    // Kiểm tra ratingId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
      return res.status(400).json({
        code: 400,
        message: "ratingId không hợp lệ",
      });
    }

    // Kiểm tra rating đầu vào
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        code: 400,
        message: "Rating phải từ 1 đến 5",
      });
    }

    // Tìm đánh giá
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đánh giá",
      });
    }

    // Kiểm tra quyền chỉnh sửa
    if (existingRating.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
      });
    }

    // Kiểm tra người dùng đã mua sách này chưa
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

    await ratingHelper.updateBookRatingMean(existingRating.book_id);

    // Populate thông tin
    const populatedRating = await Rating.findById(ratingId)
      .populate("user_id", "fullName email")
      .populate("book_id", "title");

    res.status(200).json({
      code: 200,
      message: "Cập nhật đánh giá thành công!",
      rating: populatedRating,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [DELETE] /rating/delete/:ratingId
module.exports.delete = async (req, res) => {
  try {
    const ratingId = req.params.ratingId;
    const user_id = req.user._id;

    // Kiểm tra ratingId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
      return res.status(400).json({
        code: 400,
        message: "ratingId không hợp lệ",
      });
    }

    // Tìm đánh giá
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đánh giá",
      });
    }

    // Kiểm tra quyền xóa
    if (existingRating.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa đánh giá này",
      });
    }

    // Soft delete
    existingRating.deleted = true;
    existingRating.status = "inactive";
    await existingRating.save();

    await ratingHelper.updateBookRatingMean(existingRating.book_id);

    res.status(200).json({
      code: 200,
      message: "Xóa đánh giá thành công!",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /rating/user-ratings - Thêm mới
module.exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user._id;

    // Lấy danh sách đánh giá của người dùng
    const ratings = await Rating.find({
      user_id: userId,
      status: "active",
      deleted: false,
    })
      .populate("book_id", "title thumbnail slug")
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian giảm dần

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách đánh giá của người dùng thành công!",
      ratings,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi khi lấy danh sách đánh giá",
    });
  }
};
