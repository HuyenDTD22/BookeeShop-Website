const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    books: [
      {
        book_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discountPercentage: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "momo"],
      default: "cod",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "completed", "cancelled"],
      default: "pending",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "order");

module.exports = Order;
