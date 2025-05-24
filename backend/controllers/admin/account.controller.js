const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");

//[GET] /admin/account - Lấy ra danh sách tài khoản
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
      find.fullName = objectSearch.regex;
    }

    //Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }

    const accounts = await Account.find(find)
      .sort(sort)
      .select("-password -token");

    const accountsWithRoles = await Promise.all(
      accounts.map(async (account) => {
        const plainAccount = account.toObject();
        const role = await Role.findOne({
          _id: plainAccount.role_id,
          deleted: false,
        });
        plainAccount.role = role ? role.toObject() : { title: "N/A" };
        return plainAccount;
      })
    );

    res.json({
      code: 200,
      accounts: accountsWithRoles,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi lấy danh sách tài khoản!",
      error: error.message,
    });
  }
};

// [GET] /admin/account/detail/:id - Lấy ra chi tiết tài khoản
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const account = await Account.findOne({
      _id: id,
      deleted: false,
    }).select("-password -token");

    res.json(account);
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi lấy thông tin tài khoản!",
      error: error.message,
    });
  }
};

// [PATCH] /admin/account/change-status/:id - Thay đổi trạng thái 1 tài khoản
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Account.updateOne(
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
      message: "Đã xảy ra lỗi khi thay đổi trạng thái!",
      error: error.message,
    });
  }
};

// [PATCH] /admin/account/change-multi - Thay đổi trạng thái, xoá nhiều tài khoản
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    switch (key) {
      case "status":
        await Account.updateMany(
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
        await Account.updateMany(
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
      message: "Đã xảy ra lỗi!",
      error: error.message,
    });
  }
};

//[POST] /admin/account/create - Thêm mới 1 tài khoản
module.exports.create = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại!`,
      });
    } else {
      if (req.body.password !== req.body.confirmPassword) {
        res.json({
          code: 400,
          message: "Mật khẩu và xác nhận mật khẩu không khớp!",
        });
        return;
      }

      req.body.password = md5(req.body.password);

      req.body.createdBy = {
        account_id: res.locals.user.id,
      };

      const account = new Account(req.body);

      await account.save();

      res.json({
        code: 200,
        message: "Tạo tài khoản thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi tạo tài khoản!",
      error: error.message,
    });
  }
};

//[PATCH] /admin/account/edit/:id - Chỉnh sửa tài khoản
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại!`,
      });
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }

      await Account.updateOne({ _id: id }, req.body);

      res.json({
        code: 200,
        message: "Cập nhật tài khoản thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã xảy ra lỗi khi chỉnh sửa tài khoản!",
      error: error.message,
    });
  }
};

// [DELETE] /admin/account/delete/:id - Xoá 1 tài khoản
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Account.updateOne(
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
      message: "Đã xảy ra lỗi khi xóa tài khoản!",
      error: error.message,
    });
  }
};

//[PATCH] /admin/account//my-account/:id - Chỉnh sửa tài khoản cá nhân
module.exports.EditMyAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = res.locals.user.id;
    const { fullName, phone, gender, birth, address, avatar } = req.body;

    if (id !== userId.toString()) {
      return res.status(403).json({
        code: 403,
        message: "Bạn chỉ được phép chỉnh sửa tài khoản của chính mình!",
      });
    }

    const account = await Account.findById(id).select("+password");
    if (!account || account.deleted) {
      return res.status(404).json({
        code: 404,
        message: "Tài khoản không tồn tại hoặc đã bị xóa!",
      });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (birth) updateData.birth = birth;
    if (address) updateData.address = address;
    if (avatar) updateData.avatar = avatar;

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          code: 400,
          message: "Vui lòng nhập mật khẩu cũ để thay đổi mật khẩu!",
        });
      }
      if (!newPassword || !confirmPassword) {
        return res.status(400).json({
          code: 400,
          message: "Vui lòng nhập đầy đủ mật khẩu mới và nhập lại mật khẩu!",
        });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          code: 400,
          message: "Mật khẩu mới và Nhập lại mật khẩu không khớp!",
        });
      }

      if (md5(currentPassword) !== account.password) {
        return res.status(400).json({
          code: 400,
          message: "Mật khẩu cũ không đúng!",
        });
      }

      updateData.password = md5(newPassword);
    }

    await Account.updateOne({ _id: id }, updateData);

    const updatedAccount = await Account.findById(id).select(
      "-password -token"
    );

    res.json({
      code: 200,
      message: "Cập nhật tài khoản thành công!",
      account: updatedAccount,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi chỉnh sửa tài khoản!",
      error: error.message,
    });
  }
};
