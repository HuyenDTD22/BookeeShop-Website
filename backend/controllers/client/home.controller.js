const Book = require("../../models/book.model");
const Category = require("../../models/category.model");

const bookHelper = require("../../helpers/book");
const createTreeHelper = require("../../helpers/createTree");

//[GET] /
module.exports.index = async (req, res) => {
  // Lấy ra menu chung
  const category = await Category.find({ deleted: false });

  const newCategory = createTreeHelper.tree(category);

  //Lấy ra sản phẩm nổi bật
  const booksFeatured = await Book.find({
    feature: "1",
    status: "active",
    deleted: false,
  }).lean();

  const newBooksFeatured = bookHelper.priceNewBooks(booksFeatured);

  //Lấy ra sản phẩm mới nhất
  const booksNew = await Book.find({
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(12)
    .lean();

  const newBooksNew = bookHelper.priceNewBooks(booksNew);

  res.json({
    code: 200,
    layoutCategory: newCategory,
    booksFeatured: newBooksFeatured,
    booksNew: newBooksNew,
  });
};
