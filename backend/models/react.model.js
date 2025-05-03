const mongoose = require("mongoose");

const reactSchema = new mongoose.Schema(
  {
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo chỉ có một phản ứng duy nhất từ một người dùng cho một bình luận
reactSchema.index({ comment_id: 1, user_id: 1 }, { unique: true });

const React = mongoose.model("React", reactSchema, "react");

module.exports = React;
