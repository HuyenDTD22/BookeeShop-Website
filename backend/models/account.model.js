const mongoose = require("mongoose");
// const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    // token: {
    //   type: String,
    //   default: generate.generateRandomString(20),
    // },
    phone: String,
    avatar: String,
    gender: String,
    birth: Date,
    address: String,
    role_id: String,
    status: String,
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema, "account");

module.exports = Account;
