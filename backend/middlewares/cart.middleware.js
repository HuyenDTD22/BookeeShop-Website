// const Cart = require("../models/cart.model");

// module.exports.cartId = async (req, res, next) => {
//   if (!req.cookies.cartId) {
//     const cart = new Cart();
//     await cart.save();

//     const expiresTime = 1000 * 60 * 60 * 24 * 365;

//     res.cookie("cartId", cart.id, {
//       expires: new Date(Date.now() + expiresTime),
//     });
//   } else {
//     const cart = await Cart.findOne({
//       _id: req.cookies.cartId,
//     });

//     cart.totalQuantity = cart.books.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     );

//     res.locals.miniCart = cart;
//   }

//   next();
// };

const Cart = require("../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  let cartId = req.cookies.cartId;

  if (!cartId) {
    // Tạo giỏ hàng mới nếu chưa có
    const cart = new Cart();
    await cart.save();

    cartId = cart._id;

    const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 năm
    res.cookie("cartId", cartId, {
      expires: new Date(Date.now() + expiresTime),
    });
  } else {
    // Kiểm tra và cập nhật giỏ hàng
    let cart = await Cart.findOne({ _id: cartId });

    if (!cart) {
      // Nếu cart không tồn tại (do xóa thủ công), tạo mới
      const newCart = new Cart();
      await newCart.save();
      cartId = newCart._id;
      res.cookie("cartId", cartId, {
        expires: new Date(Date.now() + expiresTime),
      });
      cart = newCart;
    }

    // Gắn user_id nếu người dùng đã đăng nhập
    if (req.user && req.user._id && !cart.user_id) {
      cart.user_id = req.user._id;
      await cart.save();
    }

    // Tính tổng số lượng trong giỏ hàng
    cart.totalQuantity = cart.books.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.locals.miniCart = cart;
  }

  next();
};
