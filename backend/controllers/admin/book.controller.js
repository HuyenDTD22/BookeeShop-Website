const Book = require("../../models/book.model");
const Account = require("../../models/account.model");
const Comment = require("../../models/comment.model");

const searchHelper = require("../../helpers/search");

// [GET] /admin/book/ - Lấy tất cả sách
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    //Bộ lọc trạng thái
    if (req.query.status) {
      find.status = req.query.status;
    }

    //Search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
      find.title = objectSearch.regex;
    }

    //Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }

    const books = await Book.find(find).sort(sort).lean();

    const bookIds = books.map((book) => book._id);
    const commentCounts = await Comment.aggregate([
      { $match: { book_id: { $in: bookIds }, deleted: false } },
      { $group: { _id: "$book_id", commentCount: { $sum: 1 } } },
    ]);

    const commentCountMap = {};
    commentCounts.forEach((item) => {
      commentCountMap[item._id.toString()] = item.commentCount;
    });

    books.forEach((book, index) => {
      book.commentCount = commentCountMap[book._id.toString()] || 0;
    });

    res.json({
      code: 200,
      books: books,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /book/detail/:id - Lấy ra chi tiết 1 sách
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await Book.findOne({
      _id: id,
      deleted: false,
    });

    res.json(book);
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /admin/book/change-status/:id - Thay đổi trạng thái 1 sách
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Book.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /admin/book/change-multi - Thay đổi trạng thái, xoá nhiều sách
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    switch (key) {
      case "status":
        await Book.updateMany(
          {
            _id: {
              $in: ids,
            },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!",
        });
        break;
      case "delete":
        await Book.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        res.json({
          code: 200,
          message: "Xóa thành công!",
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [POST] /book/create - Tạo mới 1 sách
module.exports.create = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
      const countBooks = await Book.countDocuments();
      req.body.position = countBooks + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    const book = new Book(req.body);

    const data = await book.save();

    res.json({
      code: 200,
      message: "Tạo sách thành công!",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /book/edit/:id - Chỉnh sửa 1 sách
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    await Book.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
      message: "cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [DELETE] /book/delete/:id - Xoá 1 sách
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Book.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    res.json({
      code: 200,
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};
