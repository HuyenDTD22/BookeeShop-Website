const Cart = require("../../models/cart.model");
const Book = require("../../models/book.model");

const bookHelper = require("../../helpers/book");

//[GET] /cart/ - Lấy ra danh sách sản phẩm trong giỏ hàng
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
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};

//[POST] /cart/add/:slug - Thêm 1 sản phẩm vào giỏ hàng
module.exports.add = async (req, res) => {
  try {
    const userId = req.user._id;
    const slug = req.params.slug;
    const quantity = parseInt(req.body.quantity) || 1;

    const book = await Book.findOne({ slug }).lean();
    if (!book) {
      return res.json({
        code: 404,
        message: "Không tìm thấy sách với slug này.",
      });
    }

    const bookId = book._id;

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({ user_id: userId, books: [] });
      await cart.save();
    }

    const existBookInCart = cart.books.find((item) => item.book_id == bookId);

    if (existBookInCart) {
      const newQuantity = quantity + existBookInCart.quantity;

      await Cart.updateOne(
        { user_id: userId, "books.book_id": bookId },
        { "books.$.quantity": newQuantity }
      );
    } else {
      const objectCart = { book_id: bookId, quantity: quantity };

      await Cart.updateOne(
        { user_id: userId },
        { $push: { books: objectCart } }
      );
    }

    res.json({
      code: 200,
      message: "Thêm sản phẩm vào giỏ hàng thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng!",
      error: error.message,
    });
  }
};

// [GET] /cart/delete/:bookId - Xoá 1 sản phẩm trong giỏ hàng
module.exports.delete = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;

    await Cart.updateOne(
      { user_id: userId },
      { $pull: { books: { book_id: bookId } } }
    );

    res.json({
      code: 200,
      message: "Đã xoá sản phẩm khỏi giỏ hàng!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /cart/update/:bookId/:quantity - Thay đổi số lượng sản phẩm trong giỏ hàng
module.exports.update = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    const quantity = parseInt(req.body.quantity);

    await Cart.updateOne(
      { user_id: userId, "books.book_id": bookId },
      { "books.$.quantity": quantity }
    );

    res.json({
      code: 200,
      message: "Đã cập nhật số lượng thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};
