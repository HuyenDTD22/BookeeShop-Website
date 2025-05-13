const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

//[GET] /admin/role - Lấy ra tất cả các nhóm quyền
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    if (req.query.status) {
      find.status = req.query.status;
    }

    const roles = await Role.find(find);

    res.json({
      code: 200,
      roles: roles,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /admin/role/detail/:id - lấy ra chi tiết 1 nhóm quyền
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const role = await Role.findOne({
      _id: id,
      deleted: false,
    });

    res.json(role);
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

    await Role.updateOne(
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

// [PATCH] /admin/book/change-multi - Thay đổi trạng thái, xoá nhiều nhóm quyền
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    switch (key) {
      case "status":
        await Role.updateMany(
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
        await Role.updateMany(
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

//[POST] /admin/role/create - Thêm mới 1 nhóm quyền
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    const role = new Role(req.body);

    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

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

// [DELETE] /admin/role/delete/:id - Xoá 1 nhóm quyền
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne(
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
