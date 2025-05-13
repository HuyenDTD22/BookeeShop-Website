const Book = require("../../models/book.model");
const Category = require("../../models/category.model");
const Order = require("../../models/order.model");

const bookHelper = require("../../helpers/book");
const categoryHelper = require("../../helpers/category");

//[GET] /book - Hiển thị ra danh sách sản phẩm
module.exports.index = async (req, res) => {
  try {
    const books = await Book.find({
      status: "active",
      deleted: false,
    })
      .lean()
      .sort({ position: "desc" });

    let newBooks = bookHelper.priceNewBooks(books);

    newBooks = await bookHelper.soldCountBooks(books);

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

// [GET] /book/:slugCategory - Lấy ra các sản phẩm thuộc danh mục
module.exports.category = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    const lisSubcategory = await categoryHelper.getSubCategory(category.id);

    const lisSubcategoryId = lisSubcategory.map((item) => item.id);

    const books = await Book.find({
      book_category_id: { $in: [category.id, ...lisSubcategoryId] },
      deleted: false,
    })
      .lean()
      .sort({ position: "desc" });

    let newBooks = bookHelper.priceNewBooks(books);

    newBooks = await bookHelper.soldCountBooks(books);

    res.json({
      newBooks,
      category,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

//[GET] /book/detail/:slugBook - Làm trang chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugBook,
      status: "active",
    };

    const book = await Book.findOne(find).lean();

    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy sách",
      });
    }

    if (book.book_category_id) {
      const category = await Category.findOne({
        _id: book.book_category_id,
        status: "active",
        deleted: false,
      }).lean();

      book.category = category;
    }

    bookHelper.priceNewBook(book);

    await bookHelper.soldCountBook(book);

    res.json({
      code: 200,
      book: book,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};
