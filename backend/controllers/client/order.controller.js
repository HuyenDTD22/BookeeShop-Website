const mongoose = require("mongoose");
const Cart = require("../../models/cart.model");
const Book = require("../../models/book.model");
const Order = require("../../models/order.model");

const bookHelper = require("../../helpers/book");
const orderHelper = require("../../helpers/order");
const vnpayHelper = require("../../helpers/vnpay");

// [GET] /order/ - Lấy ra tất cả các đơn hàng
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

// [POST] /order/create-vnpay - Tạo đơn hàng và redirect sang VNPay
module.exports.createVnpay = async (req, res) => {
  // Thêm tạm vào đầu createVnpay controller để debug
  console.log("=== VNPAY CONFIG ===");
  console.log("TMN_CODE:", process.env.VNPAY_TMN_CODE);
  console.log("SECRET length:", process.env.VNPAY_HASH_SECRET?.length);
  console.log("RETURN_URL:", process.env.VNPAY_RETURN_URL);
  try {
    const { items, fullName, phone, address } = req.body;
    const user_id = req.user._id;

    let books = [];
    let totalPrice = 0;

    for (const item of items) {
      const { book_id, quantity } = item;
      const book = await Book.findOne({ _id: book_id }).lean();
      if (!book) {
        return res.json({
          code: 404,
          message: `Không tìm thấy sách: ${book_id}`,
        });
      }
      bookHelper.priceNewBook(book);
      totalPrice += Number(book.priceNew) * quantity;
      books.push({
        book_id,
        price: book.price,
        discountPercentage: book.discountPercentage || 0,
        quantity,
      });
    }

    // Tạo đơn hàng với status pending, paymentStatus pending
    const order = new Order({
      user_id,
      userInfo: { fullName, phone, address },
      books,
      totalPrice,
      paymentMethod: "vnpay",
      status: "pending",
      paymentStatus: "pending",
    });
    await order.save();

    // Lấy IP của client
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    const orderInfo = `Thanh toan don hang ${order._id.toString()}`;

    const paymentUrl = vnpayHelper.createPaymentUrl(
      order._id.toString(),
      totalPrice,
      orderInfo,
      ipAddr,
    );

    res.json({ code: 200, paymentUrl });
  } catch (error) {
    res.json({ code: 500, message: error.message || "Đã xảy ra lỗi" });
  }
};

// [GET] /order/vnpay-return - VNPay callback sau khi thanh toán
module.exports.vnpayReturn = async (req, res) => {
  try {
    const isValid = vnpayHelper.verifyReturnUrl(req.query);

    if (!isValid) {
      return res.redirect(
        `${process.env.VNPAY_FRONTEND_RETURN_URL}?status=error&message=Chữ ký không hợp lệ`,
      );
    }

    const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo } = req.query;

    const order = await Order.findById(vnp_TxnRef);
    if (!order) {
      return res.redirect(
        `${process.env.VNPAY_FRONTEND_RETURN_URL}?status=error&message=Không tìm thấy đơn hàng`,
      );
    }

    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      order.paymentStatus = "paid";
      order.vnpayTransactionId = vnp_TransactionNo;
      await order.save();

      return res.redirect(
        `${process.env.VNPAY_FRONTEND_RETURN_URL}?status=success&orderId=${order._id}`,
      );
    } else {
      // Thanh toán thất bại - xóa đơn hàng hoặc đánh dấu failed
      order.paymentStatus = "failed";
      order.status = "cancelled";
      await order.save();

      return res.redirect(
        `${process.env.VNPAY_FRONTEND_RETURN_URL}?status=failed&orderId=${order._id}`,
      );
    }
  } catch (error) {
    return res.redirect(
      `${process.env.VNPAY_FRONTEND_RETURN_URL}?status=error&message=${error.message}`,
    );
  }
};

// [POST] /order/create - Tạo đơn hàng
module.exports.create = async (req, res) => {
  try {
    const { items, fullName, phone, address, paymentMethod } = req.body;
    const user_id = req.user._id;

    let books = [];
    let totalPrice = 0;
    for (const item of items) {
      const { book_id, quantity } = item;

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

    const notification = await orderHelper.createOrderStatusNotification(
      order,
      "pending",
      user_id,
    );
    if (!notification) {
      console.warn(
        `Không tạo được thông báo cho đơn hàng ${order._id}, trạng thái pending`,
      );
    }

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

// [GET] /order/success/:orderId - Đặt hàng thành công
module.exports.success = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user_id = req.user._id;

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

// [GET] /order/my-orders - Lấy ra tất cả các đơn hàng
module.exports.getMyOrders = async (req, res) => {
  try {
    const user_id = req.user._id;

    const orders = await Order.find({ user_id, deleted: false })
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title thumbnail")
      .sort({ createdAt: -1 });

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

// [GET] /order/detail/:orderId - Lấy ra thông tin chi tiết 1 đơn hàng
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user_id = req.user._id;

    const order = await Order.findById(orderId)
      .populate("user_id", "fullName email")
      .populate(
        "books.book_id",
        "title price discountPercentage thumbnail slug",
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

// [PATCH] /order/cancel/:orderId - Huỷ 1 đơn hàng
module.exports.cancel = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user_id = req.user._id;

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
