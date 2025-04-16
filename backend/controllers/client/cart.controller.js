const Cart = require("../../models/cart.model");

//[POTS] /cart/add/:bookId
module.exports.add = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const bookId = req.params.bookId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
      _id: cartId,
    });

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
