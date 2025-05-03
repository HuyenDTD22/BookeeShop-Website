const Category = require("../../models/category.model");
const Book = require("../../models/book.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
  try {
    const statistic = {
      category: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      book: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      account: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      user: {
        total: 0,
        active: 0,
        inactive: 0,
      },
    };

    // statistic.category.total = await Category.count({
    //   deleted: false,
    // });

    // statistic.category.active = await Category.count({
    //   status: "active",
    //   deleted: false,
    // });

    // statistic.category.inactive = await Category.count({
    //   status: "inactive",
    //   deleted: false,
    // });

    statistic.category = {
      total: await Category.count({ deleted: false }),
      active: await Category.count({ status: "active", deleted: false }),
      inactive: await Category.count({ status: "inactive", deleted: false }),
    };

    statistic.book = {
      total: await Book.count({ deleted: false }),
      active: await Book.count({ status: "active", deleted: false }),
      inactive: await Book.count({ status: "inactive", deleted: false }),
    };

    statistic.account = {
      total: await Account.count({ deleted: false }),
      active: await Account.count({ status: "active", deleted: false }),
      inactive: await Account.count({ status: "inactive", deleted: false }),
    };

    statistic.user = {
      total: await User.count({ deleted: false }),
      active: await User.count({ status: "active", deleted: false }),
      inactive: await User.count({ status: "inactive", deleted: false }),
    };

    res.json({
      code: 200,
      statistic: statistic,
    });
  } catch (error) {
    res.status(500).json({
      code: 400,
      message: error.message,
    });
  }
};
