const Book = require("../../models/book.model");

const bookHelper = require("../../helpers/book");

//[GET] /search
module.exports.index = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    let newBooks = [];

    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i");

      const books = await Book.find({
        title: keywordRegex,
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
