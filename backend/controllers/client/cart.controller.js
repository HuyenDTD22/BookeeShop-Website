const Cart = require("../../models/cart.model");
const Book = require("../../models/book.model");

const bookHelper = require("../../helpers/book");

//[GET] /cart/
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
      _id: cartId,
    }).lean();

    if (!cart) {
      return res.json({
        code: 404,
        message: "Giỏ hàng không tồn tại.",
        cartDetail: { books: [], totalPrice: 0 },
      });
    }

    let totalPrice = 0;

    if (cart.books && cart.books.length > 0) {
      for (const item of cart.books) {
        const bookId = item.book_id;

        const bookInfo = await Book.findOne({
          _id: bookId,
        }).lean();

        if (bookInfo) {
          // *** ĐÃ SỬA: Sử dụng bookHelper thay vì booksHelper ***
          bookHelper.priceNewBook(bookInfo); // Tính priceNew
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
      message: error.message,
    });
  }
};

//[POST] /cart/add/:bookId
module.exports.add = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const slug = req.params.slug;
    const quantity = parseInt(req.body.quantity) || 1;

    if (!cartId) {
      return res.json({
        code: 400,
        message: "Không tìm thấy giỏ hàng. Vui lòng thử lại.",
      });
    }

    const book = await Book.findOne({ slug }).lean();
    if (!book) {
      return res.json({
        code: 404,
        message: "Không tìm thấy sách với slug này.",
      });
    }

    const bookId = book._id;

    const cart = await Cart.findOne({
      _id: cartId,
    });

    if (!cart) {
      return res.json({
        code: 404,
        message: "Giỏ hàng không tồn tại.",
      });
    }

    const existBookInCart = cart.books.find((item) => item.book_id == bookId);

    if (existBookInCart) {
      //Nếu tồn tại thì chỉ cập nhật
      const newQuantity = quantity + existBookInCart.quantity;

      await Cart.updateOne(
        {
          _id: cartId,
          "books.book_id": bookId,
        },
        {
          "books.$.quantity": newQuantity,
        }
      );
    } else {
      //Thêm mới 1 sp vào giỏ hàng
      const objectCart = {
        book_id: bookId,
        quantity: quantity,
      };

      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          $push: { books: objectCart },
        }
      );

      res.json({
        code: 200,
        message: "Thêm sản phẩm vào giỏ hàng thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 200,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /cart/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const bookId = req.params.bookId;

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $pull: { books: { book_id: bookId } },
      }
    );

    res.json({
      code: 200,
      message: "Đã xoá sản phẩm khỏi giỏ hàng!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message,
    });
  }
};

// [GET] /cart/update/:bookId/:quantity
module.exports.update = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const bookId = req.params.bookId;
    const quantity = req.params.quantity;

    await Cart.updateOne(
      {
        _id: cartId,
        "books.book_id": bookId,
      },
      {
        "books.$.quantity": quantity,
      }
    );

    res.json({
      code: 200,
      message: "Đã cập nhật số lượng!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message,
    });
  }
};
