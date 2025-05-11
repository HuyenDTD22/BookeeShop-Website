const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const bookSchema = new mongoose.Schema(
  {
    title: String,
    thumbnail: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    author: String,
    supplier: String,
    publisher: String,
    publish_year: String,
    language: String,
    size: String,
    weight: String,
    page_count: String,
    rating_mean: {
      type: Number,
      default: 5,
    },
    status: String,
    feature: String,
    position: Number,
    book_category_id: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
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

const Book = mongoose.model("Book", bookSchema, "book");

module.exports = Book;
