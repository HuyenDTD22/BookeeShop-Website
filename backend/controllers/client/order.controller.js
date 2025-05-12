const mongoose = require("mongoose");
const Cart = require("../../models/cart.model");
const Book = require("../../models/book.model");
const Order = require("../../models/order.model");

const bookHelper = require("../../helpers/book");

// [GET] /order/
module.exports.index = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user_id: userId }).lean();

    if (!cart) {
      cart = new Cart({ user_id: userId, books: [] });
      await cart.save();
      cart = cart.toObject();
    }

    let totalPrice = 0;

    if (cart.books && cart.books.length > 0) {
      for (const item of cart.books) {
        const bookId = item.book_id;

        const bookInfo = await Book.findOne({ _id: bookId }).lean();

        if (bookInfo) {
          bookHelper.priceNewBook(bookInfo);
          item.bookInfo = bookInfo;
          item.totalPrice = item.quantity * bookInfo.priceNew;
          totalPrice += item.totalPrice;
        } else {
          item.bookInfo = null;
          item.totalPrice = 0;
        }
      }
    }

    cart.totalPrice = totalPrice;

    res.json({
      code: 200,
      cartDetail: cart,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [POST] /order/create
module.exports.create = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const user_id = req.user._id;

    if (!fullName || !phone || !address) {
      return res.json({
        code: 400,
        message: "fullName, phone và address là bắt buộc",
      });
    }

    const cart = await Cart.findOne({ user_id: user_id }).lean();

    if (!cart) {
      return res.json({
        code: 404,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    if (!cart.books || cart.books.length === 0) {
      return res.json({
        code: 400,
        message: "Giỏ hàng của bạn đang trống",
      });
    }

    let books = [];
    let totalPrice = 0;
    for (const item of cart.books) {
      const bookInfo = await Book.findOne({ _id: item.book_id }).lean();

      if (!bookInfo) {
        return res.json({
          code: 404,
          message: `Không tìm thấy sách với ID: ${item.book_id}`,
        });
      }

      bookHelper.priceNewBook(bookInfo);
      const bookTotalPrice = Number(bookInfo.priceNew) * item.quantity;

      const objectBook = {
        book_id: item.book_id,
        price: bookInfo.price,
        discountPercentage: bookInfo.discountPercentage || 0,
        quantity: item.quantity,
      };

      books.push(objectBook);
      totalPrice += bookTotalPrice;
    }

    const objectOrder = {
      user_id,
      userInfo: {
        fullName,
        phone,
        address,
      },
      books,
      totalPrice,
      status: "pending",
    };

    const order = new Order(objectOrder);
    await order.save();

    // Xóa giỏ hàng sau khi đặt hàng
    await Cart.updateOne({ user_id: user_id }, { books: [] });

    const populatedOrder = await Order.findById(order._id)
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title");

    res.json({
      code: 200,
      message: "Thanh toán thành công!",
      order: populatedOrder,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [POST] /order/buy-now
module.exports.buyNow = async (req, res) => {
  try {
    const { items, fullName, phone, address, paymentMethod } = req.body;
    const user_id = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({
        code: 400,
        message: "Danh sách items là bắt buộc và phải là mảng không rỗng",
      });
    }
    if (!fullName || !phone || !address || !paymentMethod) {
      return res.json({
        code: 400,
        message: "fullName, phone, address và paymentMethod là bắt buộc",
      });
    }

    let books = [];
    let totalPrice = 0;
    for (const item of items) {
      const { book_id, quantity } = item;

      if (!mongoose.Types.ObjectId.isValid(book_id)) {
        return res.json({
          code: 400,
          message: `book_id ${book_id} không hợp lệ`,
        });
      }

      if (!quantity || quantity <= 0) {
        return res.json({
          code: 400,
          message: `Số lượng cho book_id ${book_id} phải lớn hơn 0`,
        });
      }

      const book = await Book.findOne({ _id: book_id }).lean();
      if (!book) {
        return res.json({
          code: 404,
          message: `Không tìm thấy sách với ID: ${book_id}`,
        });
      }

      bookHelper.priceNewBook(book);
      const bookTotalPrice = Number(book.priceNew) * quantity;

      books.push({
        book_id,
        price: book.price,
        discountPercentage: book.discountPercentage || 0,
        quantity,
      });
      totalPrice += bookTotalPrice;
    }

    const objectOrder = {
      user_id,
      userInfo: {
        fullName,
        phone,
        address,
      },
      books,
      totalPrice,
      paymentMethod,
      status: "pending",
    };

    const order = new Order(objectOrder);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title");

    res.json({
      code: 200,
      message: "Thanh toán thành công!",
      order: populatedOrder,
    });
  } catch (error) {
    res.json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /order/success/:orderId
module.exports.success = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.json({
        code: 400,
        message: "orderId không hợp lệ",
      });
    }

    const order = await Order.findOne({ _id: orderId })
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title price discountPercentage");

    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.user_id._id.toString() !== user_id.toString()) {
      return res.json({
        code: 403,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    for (const item of order.books) {
      const bookInfo = item.book_id;
      bookInfo.priceNew = bookHelper.priceNewBook(bookInfo);
      item.totalPrice = item.quantity * bookInfo.priceNew;
    }

    res.json({
      code: 200,
      order: order,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /order/my-orders
module.exports.getMyOrders = async (req, res) => {
  try {
    const user_id = req.user._id;

    const orders = await Order.find({ user_id, deleted: false })
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title thumbnail");

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách đơn hàng thành công!",
      orders,
      totalOrders,
      totalSpent,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /order/detail/:orderId
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.json({
        code: 400,
        message: "orderId không hợp lệ",
      });
    }

    const order = await Order.findById(orderId)
      .populate("user_id", "fullName email")
      .populate(
        "books.book_id",
        "title price discountPercentage thumbnail slug"
      )
      .lean();

    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.user_id._id.toString() !== user_id.toString()) {
      return res.json({
        code: 403,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    for (const item of order.books) {
      const bookInfo = item.book_id;
      if (bookInfo) {
        bookInfo.priceNew =
          (bookInfo.price * (100 - (bookInfo.discountPercentage || 0))) / 100;
        item.totalPrice =
          item.quantity * (bookInfo.priceNew || bookInfo.price || 0);
      } else {
        item.book_id = { title: "Sách không tồn tại", priceNew: 0 };
        item.totalPrice = 0;
      }
    }

    res.status(200).json({
      code: 200,
      message: "Lấy chi tiết đơn hàng thành công!",
      order,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /order/cancel/:orderId
module.exports.cancel = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.json({
        code: 400,
        message: "orderId không hợp lệ",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.user_id._id.toString() !== user_id.toString()) {
      return res.json({
        code: 403,
        message: "Bạn không có quyền hủy đơn hàng này",
      });
    }

    if (order.status !== "pending") {
      return res.json({
        code: 400,
        message: "Chỉ có thể hủy đơn hàng đang ở trạng thái pending",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      code: 200,
      message: "Hủy đơn hàng thành công!",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};
