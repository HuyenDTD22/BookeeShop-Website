const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

//[GET] /admin/role
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    const roles = await Role.find(find);

    res.json(roles);
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

//[POST] /admin/role/create - Thêm mới 1 nhóm quyền
module.exports.create = async (req, res) => {
  try {
    const role = new Role(req.body);

    await role.save();

    res.json({
      code: 200,
      message: "Tạo nhóm quyền thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

//[PATCH] /admin/role/edit/:id - Chỉnh sửa nhóm quyền
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
      message: "Cập nhật nhóm quyền thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [PATCH] /admin/role/permissions - Xây dựng nhóm phân quyền
module.exports.permissions = async (req, res) => {
  try {
    // const permissions = JSON.parse(req.body.permissions);
    const permissions = req.body.permissions;

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }

    res.json({
      code: 200,
      message: "Cập nhật phân quyền thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};
