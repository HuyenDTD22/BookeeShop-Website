const Cart = require("../../models/cart.model");
const Book = require("../../models/book.model");

const bookHelper = require("../../helpers/book");

//[GET] /cart/
module.exports.index = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user_id: userId }).lean();

    if (!cart) {
      // Nếu không tìm thấy giỏ hàng, tạo mới
      cart = new Cart({ user_id: userId, books: [] });
      await cart.save();
      cart = cart.toObject(); // Chuyển sang plain object để xử lý
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

//[POST] /cart/add/:slug
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
      // Nếu không tìm thấy giỏ hàng, tạo mới
      cart = new Cart({ user_id: userId, books: [] });
      await cart.save();
    }

    const existBookInCart = cart.books.find((item) => item.book_id == bookId);

    if (existBookInCart) {
      // Nếu sách đã tồn tại trong giỏ, cập nhật số lượng
      const newQuantity = quantity + existBookInCart.quantity;

      await Cart.updateOne(
        { user_id: userId, "books.book_id": bookId },
        { "books.$.quantity": newQuantity }
      );
    } else {
      // Thêm sách mới vào giỏ hàng
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
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /cart/delete/:bookId
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

// [GET] /cart/update/:bookId/:quantity
module.exports.update = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    const quantity = parseInt(req.params.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      return res.json({
        code: 400,
        message: "Số lượng không hợp lệ.",
      });
    }

    await Cart.updateOne(
      { user_id: userId, "books.book_id": bookId },
      { "books.$.quantity": quantity }
    );

    res.json({
      code: 200,
      message: "Đã cập nhật số lượng!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};
