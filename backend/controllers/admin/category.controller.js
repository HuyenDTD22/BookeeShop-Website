const Category = require("../../models/category.model");

const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const searchHelper = require("../../helpers/search");

// [GET] /admin/category/ - Lấy ra tất cả danh mục
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    // Bộ lọc trạng thái
    if (req.query.status) {
      find.status = req.query.status;
    }

    // Search
    let objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
      find.title = objectSearch.regex;
    }

    // Lấy tất cả danh mục
    const records = await Category.find(find).sort({ position: 1 });

    // Lấy danh mục liên quan (cha hoặc con) nếu có keyword hoặc status
    let allRecords = records;
    if (req.query.keyword || req.query.status) {
      const relatedIds = new Set(
        records.map((record) => record._id.toString())
      );

      // Tìm danh mục cha
      const parentIds = new Set(
        records
          .filter((record) => record.parent_id)
          .map((record) => record.parent_id.toString())
      );

      // Tìm danh mục con
      const childIds = await Category.find({
        parent_id: { $in: records.map((record) => record._id) },
        deleted: false,
      }).distinct("_id");

      // Thêm tất cả ID liên quan
      parentIds.forEach((id) => relatedIds.add(id));
      childIds.forEach((id) => relatedIds.add(id.toString()));

      // Lấy tất cả danh mục liên quan
      allRecords = await Category.find({
        _id: { $in: Array.from(relatedIds) },
        deleted: false,
      }).sort({ position: 1 });
    }

    const newRecords = createTreeHelper.tree(allRecords);

    res.json({
      code: 200,
      categories: newRecords,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message,
    });
  }
};

// [GET] /category/detail/:id - Lấy ra thông tin chi tiết 1 danh mục
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
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /admin/category/change-status/:id - Thay đổi trạng thái 1 danh mục
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Category.updateOne(
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

// [PATCH] /admin/category/change-multi - Thay đổi trạng thái, xoá nhiều danh mục
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

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

//[POST] /admin/category/create - Tạo mới 1 danh mục
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
      message: error.message,
    });
  }
};

//[PATCH] /admin/category/edit/:id -Chỉnh sửa danh mục
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
      message: error.message,
    });
  }
};

// [DELETE] /admin/category/delete/:id - Tính năng xóa 1 danh mục
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    // Kiểm tra xem danh mục có danh mục con không
    const hasChildren = await Category.findOne({
      parent_id: id,
      deleted: false,
    });

    if (hasChildren) {
      return res.json({
        code: 400,
        message:
          "Không thể xóa danh mục có danh mục con. Vui lòng xóa danh mục con trước!",
      });
    }

    const result = await Category.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    if (result.modifiedCount === 0) {
      return res.json({
        code: 404,
        message: "Danh mục không tồn tại hoặc đã bị xóa!",
      });
    }

    res.json({
      code: 200,
      message: "Đã xóa thành công danh mục sản phẩm!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || "Lỗi khi xóa danh mục!",
    });
  }
};
