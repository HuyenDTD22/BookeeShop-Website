const Book = require("../../models/book.model");
const Category = require("../../models/category.model");

const bookHelper = require("../../helpers/book");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");

//[GET] / - Hiển thị dữ liệu ở trang HomePage
module.exports.index = async (req, res) => {
  // Lấy ra danh mục
  const category = await Category.find({ deleted: false });

  const newCategory = createTreeHelper.tree(category);

  //Lấy ra sản phẩm nổi bật
  const booksFeatured = await Book.find({
    feature: "1",
    status: "active",
    deleted: false,
  }).lean();

  let newBooksFeatured = bookHelper.priceNewBooks(booksFeatured);

  newBooksFeatured = await bookHelper.soldCountBooks(booksFeatured);

  //Lấy ra sản phẩm mới nhất
  const booksNew = await Book.find({
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(12)
    .lean();

  let newBooksNew = bookHelper.priceNewBooks(booksNew);
  newBooksNew = await bookHelper.soldCountBooks(booksNew);

  res.json({
    code: 200,
    layoutCategory: newCategory,
    booksFeatured: newBooksFeatured,
    booksNew: newBooksNew,
  });
};

//[GET] /search - Tìm kiếm theo tên sách, tên tác giả
module.exports.search = async (req, res) => {
  try {
    const query = req.query;
    const searchObject = searchHelper(query);

    let newBooks = [];

    if (searchObject.keyword) {
      const books = await Book.find({
        $or: [
          { title: searchObject.regex },
          { author: searchObject.regex },
          { supplier: searchObject.regex },
        ],
        status: "active",
        deleted: false,
      });

      newBooks = bookHelper.priceNewBooks(books);
      newBooks = await bookHelper.soldCountBooks(books);
    }

    res.json({
      code: 200,
      books: newBooks,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};
