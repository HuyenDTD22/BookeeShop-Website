const Book = require("../../models/book.model");

const paginationHelper = require("../../helpers/pagination");
const searchHelper = require("../../helpers/search");

// [GET] /admin/book - lấy tất cả sách
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    //Bộ lọc trạng thái
    if (req.query.status) {
      find.status = req.query.status;
    }

    //Tính năng tìm kiếm sách
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
      find.title = objectSearch.regex;
    }

    //Pagination - Phân trang
    let initPagination = {
      currentPage: 1,
      limitItems: 4,
    };

    const countBook = await Book.countDocuments(find); //Đếm số lượng sản phẩm có trong database

    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countBook
    );
    // End Pagination

    //Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort

    const books = await Book.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    // for (const book of books) {
    //   //Lấy ra thông tin người tạo
    //   const account = await Account.findOne({
    //     _id: book.createdBy.account_id,
    //   });

    //   if (user) {
    //     book.accountFullName = account.fullName;
    //   }

    //     //Lấy ra thông tin người cập nhật gần nhất
    //     const updateBy = book.updateBy[book.updatedBy.length - 1];
    //     if (updateBy) {
    //       const accountUpdated = await Account.findOne({
    //         _id: updateBy.account_id,
    //       });
    //       updateBy.accountFullName = accountUpdated.fullName;
    //     }
    // }

    res.json({
      code: 200,
      books: books,
      pagination: {
        totalItems: countBook,
        currentPage: objectPagination.currentPage,
        limitItems: objectPagination.limitItems,
        totalPages: objectPagination.totalPage,
      },
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /book/detail/:id - lấy ra chi tiết sách
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

    // const updatedBy = {
    //   account_id: res.locals.user.id,
    //   updatedAt: new Date(),
    // };

    await Book.updateOne(
      {
        _id: id,
      },
      {
        status: status,
        // $push: { updatedBy: updatedBy },
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

// [PATCH] /admin/book/change-multi - Thay đổi trạng thái nhiều sách
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    // const updatedBy = {
    //   account_id: res.locals.user.id,
    //   updatedAt: new Date(),
    // };

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
            // $push: { updatedBy: updatedBy },
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

    //Lưu logs lịch sử thay đổi sản phẩm
    // req.body.createdBy = {
    //   account_id: res.locals.user.id,
    // };

    // Kiểm tra parent_id

    const book = new Book(req.body);

    const data = await book.save();

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /book/edit/:id - Chỉnh sửa sách
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    // const updatedBy = {
    //   account_id: res.locals.user.id,
    //   updatedAt: new Date(),
    // };

    await Book.updateOne(
      { _id: id },
      req.body
      //   { ...req.body, $push: { updatedBy: updatedBy } }
    );

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

// [DELETE] /book/delete/:id
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
