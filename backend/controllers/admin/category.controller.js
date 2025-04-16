const Category = require("../../models/category.model");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

//[GET] /admin/category
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    const records = await Category.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.json(newRecords);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.json({
      code: 400,
      message: "Lỗi khi lấy danh mục",
    });
  }
};

//[POST] /admin/category/create - Tạo mới 1 danh mục sản phẩm
module.exports.create = async (req, res) => {
  try {
    if (req.body.position == "") {
      const count = await Category.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

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
