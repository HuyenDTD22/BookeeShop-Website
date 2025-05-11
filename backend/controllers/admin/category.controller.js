const Category = require("../../models/category.model");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");
const searchHelper = require("../../helpers/search");

//[GET] /admin/category
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

    //Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort

    const records = await Category.find(find).sort(sort);

    const newRecords = createTreeHelper.tree(records);

    res.json({
      code: 200,
      categories: newRecords,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.json({
      code: 400,
      message: "Lỗi khi lấy danh mục",
    });
  }
};

// [GET] /category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findOne({
      _id: id,
      deleted: false,
    });

    res.json(category);
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /admin/category/change-status/:id - Thay đổi trạng thái 1 sách
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    // const updatedBy = {
    //   account_id: res.locals.user.id,
    //   updatedAt: new Date(),
    // };

    await Category.updateOne(
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

// [PATCH] /admin/category/change-multi - Thay đổi trạng thái nhiều sách
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    // const updatedBy = {
    //   account_id: res.locals.user.id,
    //   updatedAt: new Date(),
    // };

    switch (key) {
      case "status":
        await Category.updateMany(
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
        await Category.updateMany(
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

//[POST] /admin/category/create - Tạo mới 1 danh mục sản phẩm
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    const record = new Category(req.body);
    await record.save();

    res.json({
      code: 200,
      message: "Tạo danh mục thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo danh mục thất bại!",
    });
  }
};

//[PATCH] /admin/category/edit/:id -Chỉnh sửa danh mục sản phẩm
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    await Category.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
      message: "Chỉnh sửa danh mục thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Chỉnh sửa danh mục thất bại!",
    });
  }
};

//[DELETE] /admin/category/delete/:id - Tính năng xoá 1 danh mục sản phẩm
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    await Category.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    ); //cập nhật giá trị của trường deleted là true đồng thời cập nhật luôn thời gian xoá của 1 danh mục sp trong database có id là id
    res.json({
      code: 200,
      message: "Đã xoá thành công danh mục sản phẩm!",
    });
  } catch (error) {
    res.json({
      code: 200,
      message: error,
    });
  }
};
