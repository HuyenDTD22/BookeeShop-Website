const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: String,
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    books: [
      {
        book_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number
      }
    ]
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "order");

module.exports = Order;