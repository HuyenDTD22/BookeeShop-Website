const mongoose = require("mongoose");
const Cart = require("../../models/cart.model");
const Book = require("../../models/book.model");
const Order = require("../../models/order.model");

const bookHelper = require("../../helpers/book");

//[GET] /order/
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    // Kiểm tra cartId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({
        code: 400,
        message: "cartId không hợp lệ",
      });
    }

    const cart = await Cart.findOne({
      _id: cartId,
    });

    if (!cart) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    if (cart.books.length > 0) {
      for (const item of cart.books) {
        const bookId = item.book_id;

        const bookInfo = await Book.findOne({
          _id: bookId,
        });

        if (!bookInfo) {
          return res.status(404).json({
            code: 404,
            message: `Không tìm thấy sách với ID: ${bookId}`,
          });
        }

        // Kiểm tra dữ liệu
        const quantity = Number(item.quantity) || 0;
        if (quantity <= 0) {
          return res.status(400).json({
            code: 400,
            message: `Số lượng sách (${bookId}) không hợp lệ`,
          });
        }

        const priceNew = booksHelper.priceNewBook(bookInfo);
        if (isNaN(priceNew)) {
          return res.status(400).json({
            code: 400,
            message: `Giá sách (${bookId}) không hợp lệ`,
          });
        }

        bookInfo.priceNew = priceNew;
        item.bookInfo = bookInfo;
        item.totalPrice = quantity * priceNew;
      }

      cart.totalPrice = cart.books.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
    } else {
      cart.totalPrice = 0; // Khởi tạo totalPrice nếu giỏ hàng rỗng
    }

    res.json({
      code: 200,
      cartDetail: cart,
    });
  } catch (error) {
    res.status(400).json({
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
    const cart_id = req.cookies.cartId;

    // Kiểm tra dữ liệu đầu vào
    if (!fullName || !phone || !address) {
      return res.status(400).json({
        code: 400,
        message: "fullName, phone và address là bắt buộc",
      });
    }

    // Kiểm tra cart_id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(cart_id)) {
      return res.status(400).json({
        code: 400,
        message: "cart_id không hợp lệ",
      });
    }

    // Tìm giỏ hàng
    const cart = await Cart.findOne({
      _id: cart_id,
    }).lean();

    if (!cart) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    if (!cart.books || cart.books.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Giỏ hàng của bạn đang trống",
      });
    }

    // Tạo danh sách sách cho đơn hàng
    let books = [];
    let totalPrice = 0;
    for (const book of cart.books) {
      const bookInfo = await Book.findOne({
        _id: book.book_id,
      }).lean();

      if (!bookInfo) {
        return res.status(404).json({
          code: 404,
          message: `Không tìm thấy sách với ID: ${book.book_id}`,
        });
      }

      bookHelper.priceNewBook(bookInfo);
      const bookTotalPrice = Number(bookInfo.priceNew) * book.quantity;

      const objectBook = {
        book_id: book.book_id,
        price: bookInfo.price,
        discountPercentage: bookInfo.discountPercentage || 0,
        quantity: book.quantity,
      };

      books.push(objectBook);
      totalPrice += bookTotalPrice;
    }

    // Tạo đơn hàng mới
    const objectOrder = {
      user_id,
      cart_id,
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

    // // Xóa giỏ hàng
    // await Cart.updateOne(
    //   {
    //     _id: cart_id,
    //   },
    //   {
    //     books: [],
    //   }
    // );

    // Populate thông tin
    const populatedOrder = await Order.findById(order._id)
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title");

    res.json({
      code: 200,
      message: "Thanh toán thành công!",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [POST] /order/buy-now
module.exports.buyNow = async (req, res) => {
  try {
    const { items, fullName, phone, address, paymentMethod } = req.body;
    const user_id = req.user._id;
    const cart_id = req.cookies.cartId;

    // Kiểm tra dữ liệu đầu vào
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Danh sách items là bắt buộc và phải là mảng không rỗng",
      });
    }
    if (!fullName || !phone || !address || !paymentMethod) {
      return res.status(400).json({
        code: 400,
        message: "fullName, phone, address và paymentMethod là bắt buộc",
      });
    }

    // Kiểm tra các item
    let books = [];
    let totalPrice = 0;
    for (const item of items) {
      const { book_id, quantity } = item;

      if (!mongoose.Types.ObjectId.isValid(book_id)) {
        return res.status(400).json({
          code: 400,
          message: `book_id ${book_id} không hợp lệ`,
        });
      }

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          code: 400,
          message: `Số lượng cho book_id ${book_id} phải lớn hơn 0`,
        });
      }

      const book = await Book.findOne({ _id: book_id }).lean();
      if (!book) {
        return res.status(404).json({
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

    // Tạo đơn hàng
    const objectOrder = {
      user_id,
      cart_id,
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

    // Không xóa giỏ hàng để khách hàng tiếp tục mua
    // Nếu muốn xóa, có thể thêm logic tương tự như /order/create

    // Populate thông tin
    const populatedOrder = await Order.findById(order._id)
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title");

    res.json({
      code: 200,
      message: "Thanh toán thành công!",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
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

    // Kiểm tra orderId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        code: 400,
        message: "orderId không hợp lệ",
      });
    }

    // Tìm đơn hàng
    const order = await Order.findOne({
      _id: orderId,
    })
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title price discountPercentage");

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra quyền xem đơn hàng
    if (order.user_id._id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    // book.priceNew = booksHelper.priceNewBook(book);

    // book.totalPrice = book.priceNew * book.quantity;

    // order.totalPrice = order.books.reduce(
    //   (sum, item) => sum + item.totalPrice,
    //   0
    // );

    // Tính giá mới và tổng giá cho từng sách
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

    // Lấy danh sách đơn hàng của người dùng
    const orders = await Order.find({
      user_id,
      deleted: false,
    })
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title");

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

// [GET] /detail/:orderId
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user_id = req.user._id;

    // Kiểm tra orderId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        code: 400,
        message: "orderId không hợp lệ",
      });
    }

    // Tìm đơn hàng
    const order = await Order.findById(orderId)
      .populate("user_id", "fullName email")
      .populate("books.book_id", "title price discountPercentage");

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra quyền xem đơn hàng
    if (order.user_id._id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    // Tính giá mới và tổng giá cho từng sách
    for (const item of order.books) {
      const bookInfo = item.book_id;
      bookInfo.priceNew = bookHelper.priceNewBook(bookInfo);
      item.totalPrice = item.quantity * bookInfo.priceNew;
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

    // Kiểm tra orderId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        code: 400,
        message: "orderId không hợp lệ",
      });
    }

    // Tìm đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra quyền hủy đơn hàng
    if (order.user_id._id.toString() !== user_id.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền hủy đơn hàng này",
      });
    }

    // Chỉ cho phép hủy nếu trạng thái là pending
    if (order.status !== "pending") {
      return res.status(400).json({
        code: 400,
        message: "Chỉ có thể hủy đơn hàng đang ở trạng thái pending",
      });
    }

    // Cập nhật trạng thái
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
