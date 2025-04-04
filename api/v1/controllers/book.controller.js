const Book = require("../models/book.model");

const paginationHelper = require("../../../helpers/pagination");

// [GET] /api/v1/book
module.exports.index = async (req, res) => {
  const books = await Book.find({
    deleted: false
  });

  res.json(books);
};

// [GET] /api/v1/book/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await Book.findOne({
      _id: id,
      deleted: false
    });

    res.json(book);
  } catch (error) {
    res.json("Không tìm thấy!");
  }
};